'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import * as XLSX from 'xlsx'
import Toast from '@/components/Toast'
import { CasaDePaz } from '@/domain/models/casaDePaz'

type Props = {
  inputFileRef: React.RefObject<HTMLInputElement>
  onImport?: (imported: CasaDePaz[]) => void
}

const ImportButton = ({ inputFileRef, onImport }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet) as CasaDePaz[]

      if (json.length === 0) {
        Toast.showError('Arquivo vazio ou inválido')
        return
      }

      if (onImport) onImport(json)
    } catch (err) {
      console.error('[IMPORT_ERROR]:', err)
      Toast.showError('Erro ao processar o arquivo')
    }
  }

  return (
    <>
      <button
        onClick={() => inputFileRef.current?.click()}
        className='py-2 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white '
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
