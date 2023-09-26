import MiniCard from '@/components/Card/miniCard'
import { LuChurch } from 'react-icons/lu'
import { FaUser } from 'react-icons/fa'
const Admin = () => {
  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 m-4 cursor-pointer'>
      <MiniCard name='Igrejas' href={'admin/churches'}>
        <LuChurch size={25} />
      </MiniCard>
      <MiniCard name='Administradores' href={'admin/users'}>
        <FaUser size={25} />
      </MiniCard>
    </div>
  )
}

export default Admin
