import React from 'react'
import Sidebar from '../Sidebar'
import Wrapper from '../Wrapper'

interface Props {
  children: React.ReactNode
}
const LayoutApp = ({ children }: Props) => {
  return (
    <main className='relative h-screen overflow-hidden bg-gray-50 dark:bg-gray-800'>
      <div className='flex items-start justify-between'>
        <Sidebar />
        <Wrapper>{children}</Wrapper>
      </div>
    </main>
  )
}
export default LayoutApp
