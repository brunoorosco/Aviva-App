import useWindowSize from '@/hooks/useWindow'
import React, { useEffect, useRef, useState } from 'react'
import Drawer from '../Drawer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import Wrapper from '../Wrapper'

interface Props {
  children: React.ReactNode
}

const LayoutApp = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sidebarRef = useRef(null)

  const updateDrawerState = () => {
    setIsMobile(window.innerWidth <= 1020)
  }

  useEffect(() => {
    updateDrawerState()
    window.addEventListener('resize', updateDrawerState)
    return () => {
      window.removeEventListener('resize', updateDrawerState)
    }
  }, [useWindowSize()])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <main className='relative h-screen overflow-hidden bg-gray-50 dark:bg-gray-800 w-full'>
      <div className={`flex items-start justify-between`}>
        {!isMobile ? (
          <Sidebar />
        ) : (
          <Drawer isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )}
        <Wrapper>
          {isSidebarOpen ? (
            <>
              <div
                className={'blur-sm h-screen z-40 filter contrast-50 '}
                onClick={toggleSidebar}
              >
                <Header toggleSidebar={toggleSidebar} />
                {children}
              </div>
            </>
          ) : (
            <>
              <Header toggleSidebar={toggleSidebar} />
              {children}
            </>
          )}
        </Wrapper>
      </div>
    </main>
  )
}
export default LayoutApp
