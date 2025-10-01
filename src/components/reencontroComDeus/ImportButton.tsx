import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useHttpPost } from '@/hooks/api'
import Toast from '@/components/Toast'
import * as XLSX from 'xlsx'
import { Upload } from 'lucide-react'

type Props = {
  inputFileRef: React.RefObject<HTMLInputElement>
}

const ImportButton = ({ inputFileRef }: Props) => {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet)

      setIsLoading(true)
      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/reencontroComDeus`,
        data: json
      })
      setIsLoading(false)

      if (response?.error) {
        Toast.showError('Erro na importação!')
      } else {
        Toast.showSuccess('Importado com sucesso!')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('[IMPORT_ERROR]:', error)
      Toast.showError('Erro durante o processo de importação.')
    } finally {
      // ✅ Limpa o input para permitir o mesmo arquivo ser selecionado novamente
      e.target.value = ''
    }
  }

  return (
    <>
      <button
        onClick={() => inputFileRef.current?.click()}
        className='p-3 rounded bg-blue-500 hover:bg-blue-600 text-white'
        aria-label='Importar Batizandos'
        title='Importar Encontro'
        type='button'
        disabled={isLoading}
      >
        <Upload size={20} />
      </button>

      <input
        ref={inputFileRef}
        type='file'
        accept='.xlsx,.xls'
        className='hidden'
        onChange={handleImport}
      />
    </>
  )
}

export default ImportButton
