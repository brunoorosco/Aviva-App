import { baptism } from '@/domain/models/baptism'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import Link from 'next/link'

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
  batismo: baptism[]
}

const BatismoHeader = ({ pathname, inputFileRef, batismo }: Props) => {
  const mapBaptismToExport = (m: baptism) => ({
    nome: m.data,
    rede: m.batizandos,
    churchId: m.churchId
  })

  return (
    <Header<baptism>
      title='Batismos'
      total={batismo.length}
      pathname={pathname}
      inputFileRef={inputFileRef}
      data={batismo}
      mapExport={mapBaptismToExport}
      sheetName='Batismo'
      filename='batismo.xlsx'
    />
  )
}

export default BatismoHeader

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
