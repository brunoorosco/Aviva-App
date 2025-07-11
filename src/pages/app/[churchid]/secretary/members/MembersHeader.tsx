import Link from 'next/link'
import { FaPeopleRoof } from 'react-icons/fa6'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import { User } from '@/domain/models/users'
import ImportButton from './ImportButton'
import ExportButton from './ExportButton'

type Props = {
  total: number
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  members: User[]
}

const MembersHeader = ({ total, pathname, inputFileRef, members }: Props) => {
  return (
    <div className='flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary'>
      <div>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>Membros</h2>
          <FaPeopleRoof size={24} />
        </div>
        <p className='mt-2 text-gray-400'>{total}</p>
      </div>

      <div className='flex gap-2 h-10'>
        <ExportButton members={members} />
        <ImportButton inputFileRef={inputFileRef} />
        <Link href={`${pathname}/new`}>
          <ButtonNew />
        </Link>
      </div>
    </div>
  )
}

export default MembersHeader
