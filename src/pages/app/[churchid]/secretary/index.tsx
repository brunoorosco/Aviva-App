import MiniCard from '@/components/Card/miniCard'
import { BaptismIcon } from '@/components/Sidebar/icons'
import { useRouter } from 'next/router'
import { IoSchool } from 'react-icons/io5'
import { AiOutlineWhatsApp } from 'react-icons/ai'

const Secretary = () => {
  const { asPath } = useRouter()

  return (
    <div className='grid grid-cols-2 gap-4 m-4 md:grid-cols-2 lg:grid-cols-3'>
      <MiniCard name='Escola de Profeta' href={`${asPath}/school`}>
        <IoSchool size={32} className='dark:text-gray-400' />
      </MiniCard>
      <MiniCard name='Membresia' href={`${asPath}/members`}>
        <IoSchool size={32} className='dark:text-gray-400' />
      </MiniCard>
      <MiniCard name='Batismo' href={`${asPath}/batismos`}>
        <BaptismIcon size={40} className='text-black dark:text-gray-400' />
      </MiniCard>
      <MiniCard name='WhatsApp' href={`${asPath}/whatsapp`}>
        <AiOutlineWhatsApp
          size={40}
          className='text-black dark:text-gray-400'
        />
      </MiniCard>
    </div>
  )
}
export default Secretary
