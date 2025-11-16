import * as XLSX from 'xlsx'
import { User } from '@/domain/models/users'
import { Download } from 'lucide-react'
import { Button } from '../ui/button'

type Props = {
  members: User[]
}

const ExportButton = ({ members }: Props) => {
  const handleExport = () => {
    if (!members) return

    const exportData = members.map((m) => ({
      nome: m.name,
      email: m.email,
      rede: m.cem?.name ?? '',
      rua: m.address?.street ?? '',
      numero: m.address?.number ?? '',
      cidade: m.address?.city ?? '',
      cargo: m.role ?? '',
      permissao: m.permission?.join(', ') ?? ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Membros')
    XLSX.writeFile(workbook, 'membros.xlsx')
  }

  return (
    <Button
      onClick={handleExport}
      className='p-3 rounded bg-green-500 hover:bg-green-600 text-white'
      aria-label='Exportar Membros'
      title='Exportar Membros'
      type='button'
    >
      <Download size={20} />
    </Button>
  )
}

export default ExportButton
