'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'

type SidebarWrapperProps = {
  closeSidebar: () => void
}

export const SidebarWrapper = ({ closeSidebar }: SidebarWrapperProps) => {
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || status !== 'authenticated') return null
  
  const churchId = session?.user?.churchId
  const cemId = session?.user?.cem.id

  if (!churchId || !cemId) return null

  return (
    <Sidebar
      closeSidebar={closeSidebar}
      churchId={churchId}
      cemId={cemId}
    />
  )
}
