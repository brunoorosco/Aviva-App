'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  children: React.ReactNode
  href: string
  closeSidebar: () => void
}

const LinkMenu = ({ children, href, closeSidebar }: Props) => {
  const pathname = usePathname()
  const selected = pathname === href

  return (
    <Link
      href={href}
      onClick={closeSidebar}
      className={`flex items-center justify-start w-full py-3 px-3 h-full transition-colors duration-200 border-l-4 ${
        selected
          ? 'text-gray-800 dark:text-white border-purple-500 bg-gray-200'
          : 'text-gray-400 border-transparent hover:text-gray-800'
      }`}
    >
      {children}
    </Link>
  )
}

export default LinkMenu
