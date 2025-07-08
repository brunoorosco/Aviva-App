import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
  children: React.ReactNode
  href: string
  closeSidebar: () => void
}
const LinkMenu = ({ children, href, closeSidebar }: Props) => {
  const router = useRouter()
  const { pathname } = router
  const selected = pathname === href
  return (
    <Link
      onClick={closeSidebar}
      href={href}
      className={
        selected
          ? 'flex items-center justify-start w-full py-4 px-3 h-full  text-gray-800 transition-colors duration-200 border-l-4 border-purple-500 dark:text-white'
          : 'flex items-center justify-start w-full py-4 px-3 h-full text-gray-400  transition-colors duration-200 border-l-4 border-transparent hover:text-gray-800'
      }
    >
      {children}
    </Link>
  )
}

export default LinkMenu
