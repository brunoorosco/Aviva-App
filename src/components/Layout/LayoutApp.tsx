import React, { useEffect, useState } from 'react'
import useWindowSize from '@/hooks/useWindow'
import { SidebarWrapper } from '../Sidebar'
import Drawer from '../Drawer'
import Header from '../Header'

interface Props {
  children: React.ReactNode
}

const LayoutApp = ({ children }: Props): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { width = 0 } = useWindowSize()
  const isMobile = width <= 1020

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  useEffect(() => {
    if (!isMobile) setIsSidebarOpen(false)
  }, [isMobile])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800 relative">
      {/* Sidebar permanente ou Drawer móvel */}
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
      <div className="flex flex-col flex-1 relative z-10">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>

      {/* Overlay quando a sidebar está aberta no mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}
export default LayoutApp