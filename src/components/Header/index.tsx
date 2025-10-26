'use client'
import { useSession } from 'next-auth/react'
import { GiHamburgerMenu } from 'react-icons/gi'
import Avatar from '../Avatar'
import Profile from '../Avatar/profile'
import { MdAdminPanelSettings } from 'react-icons/md'
import Link from 'next/link'

interface SidebarProps {
  toggleSidebar: () => void
}

const Header = ({ toggleSidebar }: SidebarProps) => {
  const { data: session } = useSession()
  return (
    <header className='flex items-center justify-between w-full h-16 '>
      <div className='block ml-6 lg:hidden '>
        <button
          onClick={toggleSidebar}
          className='flex items-center p-2 text-gray-700 bg-gray-300 rounded-full shadow text-md'
        >
          <GiHamburgerMenu size={26} />
        </button>
      </div>
      <div className='relative z-20 flex flex-col justify-end h-full px-3 md:w-full'>
        <div className='relative flex items-center justify-end w-full p-1 pr-3 mb-1 space-x-4'>
          {session?.user?.permissions?.includes('admin') && (
            <>
              <Link href={'/app/admin'}>
                <MdAdminPanelSettings
                  size={35}
                  color={'#4b4e52'}
                  className='cursor-pointer'
                />
              </Link>
            </>
          )}
          <a href='#' className='relative block'>
            <Profile trigger={<Avatar name={session?.user?.name || ''} />} />
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
