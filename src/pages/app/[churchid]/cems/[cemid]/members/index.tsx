import Avatar from '@/components/Avatar'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
// import Skeleton from '@/components/Skeleton'
import { useHttpDelete, useHttpGet } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { FaPeopleRoof } from 'react-icons/fa6'

type TAddress = {
  street: string
  number: string
  city: string
  cep: string
  state: string
}

export type TMembers = {
  userId: string
  name: string
  email: string
  birth?: Date
  image?: string
  address?: TAddress[]
}

const Members = () => {
  const router = useRouter()
  const { pathname, asPath } = router
  const { data: session } = useSession()
  const churchId = session?.user.churchId as string
  const cemId = session?.user.cemId as string
  const baseUrl = `/api/protected/churches/${churchId}/cems`

  const {
    data: members,
    error,
    isLoading
  } = useHttpGet<TMembers[]>(`${baseUrl}/${cemId}/members`)

  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>
  }
  const handleDelete = async (id: string) => {
    const response = await useHttpDelete({
      url: `/api/protected/churches/${churchId}/cems/${id}/members`
    })
  }
  console.log(members)
  return (
    <div className='flex flex-col content-center w-full max-w-lg p-3 mx-auto rounded-lg dark:text-dark-primary'>
      {/* {isLoading ? (
        <Skeleton />
      ) : (
        <> */}
      <div className='flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary'>
        <div className=''>
          <div className='flex justify-between'>
            <p className='mr-3 text-2xl font-bold leading-5'>Membros</p>
            <div className='leading-5'>
              <FaPeopleRoof size={24} />
            </div>
          </div>
          <p className='mt-2 mb-5 text-gray-400'>{members?.length}</p>
        </div>
        <div>
          <Link href={pathname + '/new'}>
            <ButtonNew />
          </Link>
        </div>
      </div>
      <div className='shadow-sm'>
        <ul className='w-full p-4 mx-auto bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
          <Suspense fallback={'Loading....'}>
            {members &&
              members.map((member: TMembers, index: number) => (
                <li className='pb-3 sm:pb-4' key={index}>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center justify-center w-12 h-12 mt-2 text-2xl text-white rounded-full bg-app-bg'>
                      <Avatar name={member.name} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate dark:text-gray-200'>
                        {member.name}
                      </p>
                      <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                        {member.email}
                      </p>

                      <Address member={member} />
                    </div>
                    <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark-primary'>
                      <Link href={`${asPath}/${member.userId}`}>
                        <FaEdit className='mx-2 cursor-pointer' size={18} />
                      </Link>
                      <FaTrash
                        className='mx-2 cursor-pointer'
                        size={17}
                        onClick={() => handleDelete(member.userId)}
                      />
                    </div>
                  </div>
                </li>
              ))}
          </Suspense>
        </ul>
      </div>
      {/* </>
      )} */}
    </div>
  )
}

const Address = ({ member }: any) => {
  // const address = member.address as TAddress[]
  const fullAddress =
    // address.length > 0
    // ?
    `${member?.street || ''}, ${member?.number || ''} - ${member?.city || ''}`
  // : ''

  return (
    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
      {fullAddress}
    </p>
  )
}

export default Members
