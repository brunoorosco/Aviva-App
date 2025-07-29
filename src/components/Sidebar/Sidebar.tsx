'use client'

import { signOut } from 'next-auth/react'
import { BiLogOut } from 'react-icons/bi'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import { useState, useMemo } from 'react'
import LinkMenu from './LinkMenu'
import { menuItems } from './menuRoute'
import { MenuIcon, X } from 'lucide-react'

type SidebarProps = {
  churchId: string
  cemId: string
  closeSidebar: () => void
}

export const Sidebar = ({ churchId, cemId, closeSidebar }: SidebarProps) => {
  const pathname = usePathname()
  const [toggleCollapse, setToggleCollapse] = useState(false)

  const menu = useMemo(() => menuItems({ churchId, cemId }), [churchId, cemId])

  const getNavItemClasses = (item: any) =>
    classNames(
      'flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap'
    )

  const wrapperClasses = classNames(
    'h-screen flex px-4 pb-4 bg-gray-100 dark:bg-gray-700 justify-between flex-col',
    {
      'w-80': !toggleCollapse,
      'w-20': toggleCollapse
    }
  )

  return (
    <div className={wrapperClasses} style={{ transition: 'width 300ms' }}>
      <div className='flex flex-col'>
        <div className='relative flex items-center justify-between'>
          <button
            onClick={() => setToggleCollapse((prev) => !prev)}
            className={`absolute top-2 ${
              !toggleCollapse ? 'right-0' : 'right-2'
            } text-gray-500 hover:text-gray-700`}
            aria-label='Fechar Sidebar'
          >
            {!toggleCollapse ? (
              <X className='h-5 w-5' />
            ) : (
              <MenuIcon size={25} />
            )}
          </button>
          <div className='flex items-center gap-4 pl-1'>
            <img src='/logo-preto.png' width='70%' className='mx-auto my-12' />
          </div>
        </div>

        <div className='flex flex-col items-start mt-1'>
          {menu.map((item) => (
            <div className={getNavItemClasses(item)} key={item.id}>
              <LinkMenu closeSidebar={closeSidebar} href={item.link}>
                <div style={{ width: '2.5rem' }}>{item.icon}</div>
                {!toggleCollapse && (
                  <span className='text-md font-medium text-text-light'>
                    {item.label}
                  </span>
                )}
              </LinkMenu>
            </div>
          ))}
        </div>
      </div>

      <div className='flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap px-3 py-4'>
        <button onClick={() => signOut()} className='flex items-center'>
          <div style={{ width: '2.5rem' }}>
            <BiLogOut size={25} />
          </div>
          {!toggleCollapse && (
            <span className='text-md font-medium text-text-light'>Sair</span>
          )}
        </button>
      </div>
    </div>
  )
}
