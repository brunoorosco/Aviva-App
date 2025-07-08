import classNames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { BiLogOut } from 'react-icons/bi'
import { IoCloseSharp } from 'react-icons/io5'
import LinkMenu from '../Sidebar/LinkMenu'
import { menuItems } from '../Sidebar/menuRoute'

export interface IDrawer {
  toggleSidebar: () => void
  isOpen: boolean
  closeSidebar: () => void
}

const Drawer: React.FC<IDrawer> = ({ toggleSidebar, isOpen, closeSidebar }) => {
  const { data: session } = useSession()
  const churchId = session?.user.churchId as string
  const cemId = session?.user.cemId as string
  const menu = menuItems({ churchId, cemId })
  const pathRouter = `/app/${churchId}`

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-72 bg-gray-100 dark:bg-gray-700 z-50 text-white transition-transform transform flex flex-col justify-between
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className='flex flex-col'>
        <div
          className='flex items-center justify-end p-2 text-gray-600'
          onClick={toggleSidebar}
        >
          <IoCloseSharp size={22} />
        </div>
        <div className='relative flex items-center justify-between'>
          <div className='flex items-center gap-4 pl-1'>
            <div className='block'>
              <img
                src='/logo-preto.png'
                width='70%'
                className='mx-auto my-16'
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col items-start mt-1'>
          {menu.map(({ ...menu }, index) => {
            return (
              <div key={index}>
                <LinkMenu
                  closeSidebar={closeSidebar}
                  href={pathRouter + menu.link}
                >
                  <div style={{ width: '2.5rem' }}>{menu.icon}</div>
                  <span
                    className={classNames(
                      'text-md font-medium text-text-light'
                    )}
                  >
                    {menu.label}
                  </span>
                </LinkMenu>
              </div>
            )
          })}
        </div>
      </div>

      <div
        className={`flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap px-3 py-4`}
      >
        <a className='flex' onClick={() => signOut()}>
          <div style={{ width: '2.5rem' }}>
            <BiLogOut size={25} />
          </div>
          <span className={classNames('text-md font-medium text-text-light')}>
            Sair
          </span>
        </a>
      </div>
    </div>
  )
}

export default Drawer
