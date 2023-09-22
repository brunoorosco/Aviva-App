import React from 'react'
import Sidebar from '../Sidebar'

interface Props {
  children: React.ReactNode
}
const LayoutTenant = ({ children }: Props) => {
  return <>{children}</>
}
export default LayoutTenant
