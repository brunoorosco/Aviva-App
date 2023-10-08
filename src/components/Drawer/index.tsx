import classNames from 'classnames'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BiLogOut } from 'react-icons/bi'
import LinkMenu from '../Sidebar/LinkMenu'
import { menuItems } from '../Sidebar/menuRoute'

export interface ISidebar {
  isOpen: boolean
}

const Drawer: React.FC<ISidebar> = ({ isOpen }) => {
  const router = useRouter()
  const { asPath, query } = router
  const pathRouter = `/app/${query.churchid}`
  return (
    <div
      className={`fixed top-0 left-0 h-screen w-72 bg-gray-100 dark:bg-gray-700 z-10 text-white transition-transform transform flex flex-col justify-between
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
        </div>

        <div className='flex flex-col items-start mt-1'>
          {menuItems.map(({ ...menu }, index) => {
            function getNavItemClasses(menu: {
              id: number
              label: string
              icon: JSX.Element
              link: string
            }): string | undefined {
              throw new Error('Function not implemented.')
            }

            // const classes = getNavItemClasses(menu)
            return (
              <div key={index}>
                <LinkMenu href={pathRouter + menu.link}>
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
