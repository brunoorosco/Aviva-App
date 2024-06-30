import Avatar from '@/components/Avatar'
// import Skeleton from '@/components/Skeleton'
import { useHttpDelete, useHttpGet } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Suspense } from 'react'

export type TMembers = {
  id: string
  userName: string
  email: string
  birth?: Date
  image?: string
  profile: string
  street: string
  number: string
  city: string
  cep: string
  state: string
  phone: string
}

const MembersById = (path: any) => {
  const router = useRouter()
  const { pathname, query } = router
  const { data: session } = useSession()
  const churchId = session?.user.churchId as string
  const cemId = session?.user.cemId as string
  const {
    data: member,
    error,
    isLoading
  } = useHttpGet<TMembers[]>(
    `/api/protected/churches/${churchId}/cems/${cemId}/members/${query.memberId}`
  )

  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>
  }
  return (
    <div className='container'>
      <Suspense fallback={<p>Loading...</p>}>
        {member?.data.length ? (
          <div className='relative w-5/6 mx-auto mt-20 bg-white rounded-lg shadow md:w-5/6 lg:w-4/6 xl:w-3/6 md:mt-24'>
            <div className='flex justify-center'>
              <Avatar
                name={member.data[0].userName}
                className='absolute mx-auto text-4xl transition duration-200 transform w-28 h-28 -top-20 hover:scale-110'
              />
            </div>
            <div className='mt-16'>
              <h1 className='text-3xl font-bold text-center text-gray-900'>
                {member.data[0].userName}
              </h1>
              <p className='text-sm font-medium text-center text-gray-400'>
                {member.data[0].profile || ''}
              </p>
              <p>
                <span></span>
              </p>
              <div className='px-6 my-5'>
                <div className='flex flex-col px-6 py-3 font-medium leading-6 text-center text-gray-200 bg-gray-900 rounded-lg'>
                  <span className='font-bold'>{member.data[0].email}</span>
                  <span className='font-bold'>{member.data[0].phone}</span>
                  <span className='font-bold'>
                    <Address>{member.data[0]}</Address>
                  </span>
                </div>
              </div>
              <div className='flex items-center justify-between px-6 my-5'>
                <a
                  href=''
                  className='w-full py-3 text-sm font-medium text-center text-gray-500 transition duration-150 ease-in rounded hover:text-gray-900 hover:bg-gray-100'
                >
                  TMAC
                </a>

                <a
                  href=''
                  className='w-full py-3 text-sm font-medium text-center text-gray-500 transition duration-150 ease-in rounded hover:text-gray-900 hover:bg-gray-100'
                >
                  Batismo
                </a>
              </div>
              <div className='w-full'>
                <h3 className='px-6 font-medium text-left text-gray-900'>
                  Participante dos Ministérios
                </h3>
                <div className='flex flex-col items-center w-full mt-5 overflow-hidden text-sm'>
                  <a
                    href='#'
                    className='block w-full py-4 pl-6 pr-3 text-gray-600 transition duration-150 border-t border-gray-100 hover:bg-gray-100'
                  >
                    <img
                      src='https://avatars0.githubusercontent.com/u/35900628?v=4'
                      alt=''
                      className='inline-block h-6 mr-2 rounded-full shadow-md'
                    />
                    Updated his status
                    <span className='text-xs text-gray-500'>24 min ago</span>
                  </a>
                  <a
                    href='#'
                    className='block w-full py-4 pl-6 pr-3 text-gray-600 transition duration-150 border-t border-gray-100 hover:bg-gray-100'
                  >
                    <img
                      src='https://avatars0.githubusercontent.com/u/35900628?v=4'
                      alt=''
                      className='inline-block h-6 mr-2 rounded-full shadow-md'
                    />
                    Added new profile picture
                    <span className='text-xs text-gray-500'>42 min ago</span>
                  </a>
                  <a
                    href='#'
                    className='block w-full py-4 pl-6 pr-3 text-gray-600 transition duration-150 border-t border-gray-100 hover:bg-gray-100'
                  >
                    <img
                      src='https://avatars0.githubusercontent.com/u/35900628?v=4'
                      alt=''
                      className='inline-block h-6 mr-2 rounded-full shadow-md'
                    />
                    Posted new article in{' '}
                    <span className='font-bold'>#Web Dev</span>
                    <span className='text-xs text-gray-500'>49 min ago</span>
                  </a>
                  <a
                    href='#'
                    className='block w-full py-4 pl-6 pr-3 text-gray-600 transition duration-150 border-t border-gray-100 hover:bg-gray-100'
                  >
                    <img
                      src='https://avatars0.githubusercontent.com/u/35900628?v=4'
                      alt=''
                      className='inline-block h-6 mr-2 rounded-full shadow-md'
                    />
                    Edited website settings
                    <span className='text-xs text-gray-500'>1 day ago</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
          // <section className='flex items-center h-screen p-16 bg-gray-50 dark:bg-gray-700'>
          //   <div className='container flex flex-col items-center'>
          //     <div className='flex flex-col max-w-md gap-6 text-center'>
          //       <h2 className='font-extrabold text-gray-600 text-9xl'>
          //         <span className='sr-only'>Error</span>404
          //       </h2>
          //       <p className='text-2xl md:text-3xl dark:text-gray-400'>
          //         Membro não encontrado
          //       </p>
          //       <a
          //         href='#'
          //         className='px-8 py-4 text-xl font-semibold bg-purple-600 rounded text-gray-50 hover:text-gray-200'
          //       >
          //         Back to homepage
          //       </a>
          //     </div>
          //   </div>
          // </section>
        )}
      </Suspense>
    </div>
  )
}

const Address = ({ children }: any) => {
  // const address = member.address as TAddress[]
  const fullAddress =
    // address.length > 0
    // ?
    `${children?.street || ''}, ${children?.number || ''} - ${
      children?.city || ''
    }`
  // : ''

  return (
    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
      {fullAddress}
    </p>
  )
}

export default MembersById
