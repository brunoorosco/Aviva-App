import { TEncontroComDeus } from '@/domain/models/encontroComDeus'
import Link from 'next/link'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'

type TProps<T> = {
  total: number
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  data: T[]
  mapExport?: any
  sheetName?: string
  filename?: string
  title?: string
}

type Props = {
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  encontro: TEncontroComDeus[]
}

const SejaLivreHeader = ({ pathname, inputFileRef, encontro }: Props) => {
  const mapEncontroToExport = (m: TEncontroComDeus) => ({
    nome: "",
    rede: "",
    igreja: ""
  })

  return (
    <Header<TEncontroComDeus>
      title='Encontro Seja Livre'
      total={encontro.length}
      pathname={pathname}
      inputFileRef={inputFileRef}
      data={encontro}
      mapExport={mapEncontroToExport}
      sheetName='seja_livre'
      filename='seja_livre.xlsx'
    />
  )
}

export default SejaLivreHeader

const Header = <T,>({
  total,
  pathname,
  inputFileRef,
  data,
  mapExport,
  sheetName = 'Export',
  filename = 'export.xlsx',
  title = 'Itens'
}: TProps<T>) => {
  return (
    <div className='flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary'>
      <div>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>{title}</h2>
        </div>
        <p className='mt-2 text-gray-400'>{total}</p>
      </div>

      <div className='flex gap-2 h-10'>
        <Link href={`${pathname}/new`}>
          <ButtonNew />
        </Link>
      </div>
    </div>
  )
}
