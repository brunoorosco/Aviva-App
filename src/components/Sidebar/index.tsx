import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { BiLogOut, BiHome } from 'react-icons/bi'
import LinkMenu from './LinkMenu'

const Sidebar = () => {
  const router = useRouter()
  const { pathname } = router

  return (
    <div className='relative hidden h-screen shadow-lg lg:block w-80'>
      <div className='h-full bg-white dark:bg-gray-700'>
        <div className='flex items-center justify-start pt-6 ml-8'>
          <p className='text-xl font-bold dark:text-white'>Avivamento</p>
        </div>
        <nav className='mt-6'>
          <div>
            <LinkMenu href={pathname}>
              <BiHome size={25} />
              <span className='mx-4 text-sm font-normal'>Home</span>
            </LinkMenu>
            <LinkMenu href='/'>
              <BiHome size={25} />
              <span className='mx-4 text-sm font-normal'>Home</span>
            </LinkMenu>
            <LinkMenu href='/app'>
              <BiHome size={25} />
              <span className='mx-4 text-sm font-normal'>Home</span>
            </LinkMenu>

            <a
              className='flex items-center justify-start w-full p-2 pl-6 my-2 text-gray-400 transition-colors duration-200 border-l-4 border-transparent hover:text-gray-800 cursor-pointer'
              onClick={() => signOut()}
            >
              <BiLogOut size={25} />
              <span className='mx-4 text-sm font-normal'>Sair</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  )
}
export default Sidebar
