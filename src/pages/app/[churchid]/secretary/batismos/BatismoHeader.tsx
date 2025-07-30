import Link from 'next/link'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import { baptism } from '@/domain/models/baptism'
import ImportButton from './ImportButton'
import ExportButton from './ExportButton'

type Props = {
  total: number
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  batismo: baptism[]
}

const BatismoHeader = ({ total, pathname, inputFileRef, batismo }: Props) => {
  return (
    <div className='flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary'>
      <div>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>Batismos</h2>
          {/* <FaPeopleRoof size={24} /> */}
        </div>
        <p className='mt-2 text-gray-400'>{total}</p>
      </div>

      <div className='flex gap-2 h-10'>
        <ExportButton batismos={batismo} />
        <ImportButton inputFileRef={inputFileRef} />
        <Link href={`${pathname}/new`}>
          <ButtonNew />
        </Link>
      </div>
    </div>
  )
}

export default BatismoHeader
