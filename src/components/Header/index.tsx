import { useSession } from 'next-auth/react'
import { GiHamburgerMenu } from 'react-icons/gi'
import Avatar from '../Avatar'
import Profile from '../Avatar/profile'
import { MdAdminPanelSettings } from 'react-icons/md'
import Link from 'next/link'

const Header = () => {
  const { data: session } = useSession()

  return (
    <header className='z-40 flex items-center justify-between w-full h-16 bg-app-gray'>
      <div className='block ml-6 lg:hidden '>
        <GiHamburgerMenu size={30} color='#e9e9e9' />
      </div>
      <div className='relative z-20 flex flex-col justify-end h-full px-3 md:w-full'>
        <div className='relative flex items-center justify-end w-full p-1 pr-3 space-x-4 mb-1'>
          <Link href={'/app/admin'}>
            <MdAdminPanelSettings
              size={35}
              color={'#e9e9e9'}
              className='cursor-pointer'
            />
          </Link>
          <a href='#' className='relative block'>
            <Profile trigger={<Avatar name={session?.user?.name || ''} />} />
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
