import * as XLSX from 'xlsx'
import { Download } from 'lucide-react'

type Props<T> = {
  items: T[]
  filename?: string
  sheetName?: string
  mapExport?: (item: T) => Record<string, any>
}

const ExportButton = <T,>({
  items,
  filename = 'export.xlsx',
  sheetName = 'Planilha',
  mapExport
}: Props<T>) => {
  const handleExport = () => {
    if (!items || items.length === 0) return

    const exportData = mapExport ? items.map(mapExport) : items

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, filename)
  }

  return (
    <button
      onClick={handleExport}
      className="p-3 rounded bg-green-500 hover:bg-green-600 text-white"
      aria-label="Exportar dados"
      title="Exportar dados"
      type="button"
    >
      <Download size={20} />
    </button>
  )
}

export default ExportButton
