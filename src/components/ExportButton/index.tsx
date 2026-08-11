import * as XLSX from 'xlsx'
import { Download, FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'

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
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!items || items.length === 0) return

    setIsExporting(true)
    
    try {
      // Pequeno delay para UX
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const exportData = mapExport ? items.map(mapExport) : items
      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
      XLSX.writeFile(workbook, filename)
    } catch (error) {
      console.error('Erro ao exportar:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const isEmpty = !items || items.length === 0

  return (
    <button
      onClick={handleExport}
      disabled={isEmpty || isExporting}
      className="
        inline-flex items-center justify-center
        h-8 w-8 sm:h-auto sm:w-auto sm:px-4 sm:py-2
        text-sm font-medium text-white
        bg-blue-600 hover:bg-blue-700 
        dark:bg-blue-700 dark:hover:bg-blue-800
        border border-transparent
        rounded-lg shadow-sm
        transition-all duration-200 ease-in-out
        hover:shadow-md active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        disabled:opacity-50 disabled:cursor-not-allowed
      "
      aria-label={`Exportar ${items?.length || 0} itens para Excel`}
      title={isEmpty ? 'Nenhum item para exportar' : 'Exportar para Excel'}
      type="button"
    >
      {isExporting ? (
        <>
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </>
      ) : (
        <Download className="w-4 h-4" />
      )}
    </button>
  )
}

export default ExportButton
