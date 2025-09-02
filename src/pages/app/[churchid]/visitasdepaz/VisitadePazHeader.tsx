import { baptism } from '@/domain/models/baptism'
import Link from 'next/link'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import ExportButton from '@/components/ExportButton'
import { CasaDePaz, CasaDePazModel } from '@/domain/models/casaDePaz'
// import ExportButton from '../ExportButton'

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
  casasdepaz: CasaDePazModel[]
}

const VisitadePazHeader = ({ pathname, inputFileRef, casasdepaz }: Props) => {
  const mapBaptismToExport = (m: Omit<CasaDePaz, '_id'>) => ({
    lider1:'',
    lider2:'',
    endereço: '',
    anfitria:'',
    telefone:''
    })

  return (
    <Header<CasaDePazModel>
      title='Visitas de Paz'
      total={casasdepaz.length}
      pathname={pathname}
      inputFileRef={inputFileRef}
      data={casasdepaz}
      mapExport={mapBaptismToExport}
      sheetName='Visitas'
      filename='visita_de_paz.xlsx'
    />
  )
}

export default VisitadePazHeader

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
