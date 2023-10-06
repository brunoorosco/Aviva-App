import Link from 'next/link'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

interface Props {
  children: React.ReactNode
  name: string
  href: any
}

const MiniCard = ({ children, name, href }: Props) => {
  return (
    <Link href={href}>
      <div className='w-full cursor-pointer'>
        <div className='flex flex-col justify-center items-center  w-full px-4 py-6 bg-white shadow-lg dark:bg-gray-700 rounded'>
          <p className='text-2xl text-center font-semibold text-gray-700 w-max dark:text-gray-300'>
            {name}
          </p>
          <div className='content-center my-6 space-x-2'>{children}</div>
        </div>
      </div>
    </Link>
  )
}

export default MiniCard
