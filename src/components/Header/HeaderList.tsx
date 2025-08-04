'use client'
import Link from 'next/link'
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
  ImportComponent: React.ReactNode // <- Aqui aceitamos o botão como componente
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
    <div className="flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <p className="mt-2 text-gray-400">{total}</p>
      </div>

      <div className="flex gap-2 h-10">
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
  )
}

export default Header
