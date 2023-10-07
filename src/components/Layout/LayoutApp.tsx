import React, { useState } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import Wrapper from '../Wrapper'

interface Props {
  children: React.ReactNode
}

const LayoutApp = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <main className='relative h-screen overflow-hidden bg-gray-50 dark:bg-gray-800 w-full'>
      <div className='flex items-start justify-between'>
        <Sidebar isOpen={isSidebarOpen} />
        <Wrapper>
          <Header toggleSidebar={toggleSidebar} />
          {children}
        </Wrapper>
      </div>
    </main>
  )
}
export default LayoutApp
