import React, { useEffect, useState } from 'react'
import useWindowSize from '@/hooks/useWindow'
import {SidebarWrapper} from '../Sidebar'
import Drawer from '../Drawer'
import Header from '../Header'
import Wrapper from '../Wrapper'

interface Props {
  children: React.ReactNode
}

const LayoutApp = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { width = 0 } = useWindowSize()
  const isMobile = width <= 1020

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false)
    }
  }, [isMobile])

  const Content = (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      {/* Sidebar fixo */}
      {!isMobile ? (
        <SidebarWrapper closeSidebar={closeSidebar} />
      ) : (
        <Drawer
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1">
        {isSidebarOpen && isMobile ? (
          <div
            className="blur-sm filter contrast-50 h-screen z-40 overflow-hidden"
            onClick={toggleSidebar}
          >
            {Content}
          </div>
        ) : (
          Content
        )}
      </div>
    </div>
  )
}

export default LayoutApp
