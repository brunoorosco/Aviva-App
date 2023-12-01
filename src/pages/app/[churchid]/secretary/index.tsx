import MiniCard from '@/components/Card/miniCard'
import { BaptismIcon } from '@/components/Sidebar/icons'
import { useRouter } from 'next/router'
import { IoSchool } from 'react-icons/io5'

const Secretary = () => {
  const { asPath } = useRouter()

  return (
    <div className='grid grid-cols-2 gap-4 m-4 md:grid-cols-2 lg:grid-cols-3'>
      <MiniCard name='Escola de Profeta' href={`${asPath}/school`}>
        <IoSchool size={32} className='dark:text-gray-400' />
      </MiniCard>
      <MiniCard name='Batismo' href={`${asPath}/baptism`}>
        <BaptismIcon size={40} className='text-black dark:text-gray-400' />
      </MiniCard>
    </div>
  )
}
export default Secretary
