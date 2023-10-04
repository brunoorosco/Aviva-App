import { signOut } from 'next-auth/react'
import { BiLogOut, BiHome, BiCollapse } from 'react-icons/bi'
import LinkMenu from './LinkMenu'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { useState, useMemo } from 'react'

const menuItems = [
  { id: 1, label: 'Home', icon: <BiHome size={25} />, link: '/app' },
  {
    id: 2,
    label: 'CEMs',
    icon: <BiLogOut size={25} />,
    link: '/posts'
  },
  {
    id: 3,
    label: 'Membros',
    icon: <BiLogOut size={25} />,
    link: '/users'
  },
  {
    id: 4,
    label: 'Outros',
    icon: <BiLogOut size={25} />,
    link: '/tutorials'
  }
]

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false)
  const [isCollapsible, setIsCollapsible] = useState(false)

  const router = useRouter()
  const { pathname } = router

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === router.pathname),
    [router.pathname]
  )

  const wrapperClasses = classNames(
    'h-screen px-4 pt-2 pb-4 bg-gray-100 flex justify-between flex-col',
    {
      ['w-80']: !toggleCollapse,
      ['w-20']: toggleCollapse
    }
  )

  const collapseIconClasses = classNames(
    'p-3 rounded bg-light-lighter absolute right-0 top-0',
    {
      'rotate-180': toggleCollapse
    }
  )

  const getNavItemClasses = (menu: any) => {
    return classNames(
      'flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap',
      {
        ['bg-light-lighter']: activeMenu?.id === menu.id
      }
    )
  }

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible)
  }

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse)
  }

  return (
    <div
      className={`${wrapperClasses}`}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: 'width 300ms cubic-bezier(0.2, 0, 0, 1) 0s' }}
    >
      <div className='flex flex-col'>
        <div className='flex items-center justify-between relative'>
          <div className='flex items-center pl-1 gap-4'>
            <div className='block'>
              <img
                src='/logo-preto.png'
                width='70%'
                className='mx-auto my-16'
              />
            </div>
          </div>
          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <BiCollapse size={25} />
            </button>
          )}
        </div>

        <div className='flex flex-col items-start mt-1'>
          {menuItems.map(({ ...menu }) => {
            const classes = getNavItemClasses(menu)
            return (
              <div className={classes}>
                <LinkMenu href={menu.link}>
                  <div style={{ width: '2.5rem' }}>{menu.icon}</div>
                  {!toggleCollapse && (
                    <span
                      className={classNames(
                        'text-md font-medium text-text-light'
                      )}
                    >
                      {menu.label}
                    </span>
                  )}
                </LinkMenu>
              </div>
            )
          })}
        </div>
      </div>

      <div className={`${getNavItemClasses({})} px-3 py-4`}>
        <a className='flex' onClick={() => signOut()}>
          <div style={{ width: '2.5rem' }}>
            <BiLogOut size={25} />
          </div>
          {!toggleCollapse && (
            <span className={classNames('text-md font-medium text-text-light')}>
              Sair
            </span>
          )}
        </a>
      </div>
    </div>
  )
}

export default Sidebar
