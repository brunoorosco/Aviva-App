'use client'
import Link from 'next/link'
import { Plus, FileSpreadsheet, Upload } from 'lucide-react'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import ExportButton from '../ExportButton'

type Props<T> = {
  total: number
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  data: T[]
  mapExport?: (item: T) => Record<string, any>
  sheetName?: string
  filename?: string
  title?: string
  ImportComponent: React.ReactNode
}

const Header = <T,>({
  total,
  pathname,
  inputFileRef,
  data,
  mapExport,
  sheetName = 'Export',
  filename = 'export.xlsx',
  title = 'Itens',
  ImportComponent
}: Props<T>) => {
  return (
    <header className="
      bg-white dark:bg-gray-800 
      border-b border-gray-200 dark:border-gray-700
      px-4 py-5 sm:px-6
      rounded-t-lg
    ">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 sm:hidden">
        {/* Título e contador */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {total} {total === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-wrap gap-2">
          <ExportButton
            items={data}
            mapExport={mapExport}
            sheetName={sheetName}
            filename={filename}
          />
          {ImportComponent}
          <Link href={`${pathname}/new`} className="flex-1 min-w-0">
            <ButtonNew />
          </Link>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {total} {total === 1 ? 'item' : 'itens'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton
            items={data}
            mapExport={mapExport}
            sheetName={sheetName}
            filename={filename}
          />
          {ImportComponent}
          <Link href={`${pathname}/new`}>
            <ButtonNew />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
