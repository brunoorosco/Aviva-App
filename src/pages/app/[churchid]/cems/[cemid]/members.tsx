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
  id: string
  name: string
  email: string
  birth?: Date
  image?: string
  address?: TAddress[]
}

const Members = () => {
  const router = useRouter()
  const { pathname } = router
  const { data: session } = useSession()
  const churchId = session?.user.churchId as string
  const cemId = session?.user.cemId as string

  const {
    data: members,
    error,
    isLoading
  } = useHttpGet<TMembers[]>(
    `/api/protected/churches/${churchId}/cems/${cemId}/members`
  )

  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>
  }
  const handleDelete = async (id: string) => {
    const response = await useHttpDelete({
      url: `/api/protected/churches/${churchId}/cems/${id}/members`
    })
  }
  return (
    <div className='content-center mx-auto flex flex-col w-full p-3 max-w-lg rounded-lg dark:text-dark-primary'>
      {/* {isLoading ? (
        <Skeleton />
      ) : (
        <> */}
      <div className='flex justify-between mt-2 bg-white px-3 pt-5 rounded-t-lg dark:bg-dark-secondary'>
        <div className=''>
          <div className='flex justify-between'>
            <p className='leading-5 text-2xl font-bold mr-3'>Membros</p>
            <div className='leading-5'>
              <FaPeopleRoof size={24} />
            </div>
          </div>
          <p className='text-gray-400 mt-2 mb-5'>{members?.length}</p>
        </div>
        <div>
          <Link href={pathname + '/new'}>
            <ButtonNew />
          </Link>
        </div>
      </div>
      <div className='shadow-sm'>
        <ul className='divide-y divide-gray-200 dark:divide-gray-700 w-full mx-auto bg-white shadow-lg p-4 dark:rounded-b-lg dark:bg-dark-secondary'>
          <Suspense fallback={'Loading....'}>
            {members &&
              members.map((member: TMembers) => (
                <li className='pb-3 sm:pb-4' key={member.id}>
                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-app-bg  text-white text-2xl rounded-full flex items-center justify-center mt-2'>
                      <Avatar name={member.name} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate dark:text-gray-200'>
                        {member.name}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                        {member.email}
                      </p>

                      <Address member={member} />
                    </div>
                    <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark-primary'>
                      <FaEdit className='cursor-pointer mx-2' size={18} />
                      <FaTrash
                        className='cursor-pointer mx-2'
                        size={17}
                        onClick={() => handleDelete(member.id)}
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

const Address = ({ address }: any) => {
  // const address = member.address as TAddress[]
  const fullAddress =
    // address.length > 0
    // ?
    `${address?.street || ''}, ${address?.number || ''} - ${
      address?.city || ''
    }`
  // : ''

  return (
    <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
      {fullAddress}
    </p>
  )
}

export default Members
