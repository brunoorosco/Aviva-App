import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
// import Skeleton from '@/components/Skeleton'
import { useHttpDelete, useHttpGet } from '@/hooks/api'
import { Churches } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaEdit, FaCross, FaTrash } from 'react-icons/fa'

const Churches = () => {
  const router = useRouter()
  const { pathname } = router

  const {
    data: churches,
    error,
    isLoading
  } = useHttpGet<Churches[]>('/api/protected/churches')

  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>
  }

  const handleDelete = async (id: string) => {
    const response = await useHttpDelete({
      url: `/api/protected/churches/${id}`
    })
  }
  return (
    <div className='flex flex-col content-center w-full max-w-lg p-3 mx-auto rounded-lg dark:text-dark-primary'>
      {/* {isLoading ? (
        <Skeleton />
      ) : (
        <> */}
      <div className='flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary'>
        <div className=''>
          <div className='flex justify-between'>
            <p className='mr-3 text-3xl font-bold leading-5'>Igrejas</p>
            <div className='leading-5'>
              <FaCross size={25} />
            </div>
          </div>
          <p className='mt-2 mb-5 text-gray-400'>{churches?.data.length}</p>
        </div>
        <div>
          <Link href={pathname + '/new'}>
            <ButtonNew />
          </Link>
        </div>
      </div>
      <div className='shadow-sm'>
        <ul className='w-full p-4 mx-auto bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
          {churches &&
            churches.data.map((church: Churches) => (
              <li className='pb-3 sm:pb-4' key={church.id}>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center justify-center w-12 h-12 mt-2 text-2xl text-white rounded-full bg-app-bg'>
                    Aviv
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate dark:text-gray-200'>
                      {church.name}
                    </p>
                    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                      {church.street +
                        ', ' +
                        church.number +
                        ' - ' +
                        church.city}
                    </p>
                  </div>
                  <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark-primary'>
                    <FaEdit className='mx-2 cursor-pointer' size={18} />
                    <FaTrash
                      className='mx-2 cursor-pointer'
                      size={17}
                      onClick={() => handleDelete(church.id)}
                    />
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
      {/* </>
      )} */}
    </div>
  )
}

export default Churches
