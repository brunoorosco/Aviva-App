import * as XLSX from 'xlsx'
import { baptism } from '@/domain/models/baptism'
import { Download } from 'lucide-react'

type Props = {
  batismos: baptism[]
}

const ExportButton = ({ batismos }: Props) => {
  const handleExport = () => {
    if (!batismos) return

    const exportData = batismos.map((m) => ({
      nome: m.data,
      rede: m.batizandos,
      churchId: m.churchId
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Batismo')
    XLSX.writeFile(workbook, 'batismo.xlsx')
  }

  return (
    <button
      onClick={handleExport}
      className='p-3 rounded bg-green-500 hover:bg-green-600 text-white'
      aria-label='Exportar Batismos'
      title='Exportar Batismos'
      type='button'
    >
      <Download size={20} />
    </button>
  )
}

export default ExportButton
