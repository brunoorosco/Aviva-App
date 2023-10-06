import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import Skeleton from '@/components/skeleton'
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
    <div className='content-center mx-auto flex flex-col w-full p-3 max-w-lg rounded-lg dark:text-dark-primary'>
      <div className='flex justify-between mt-2 bg-white px-3 pt-5 rounded-t-lg dark:bg-dark-secondary'>
        <div className=''>
          <div className='flex justify-between'>
            <p className='leading-5 text-3xl font-bold mr-3'>Igrejas</p>
            <div className='leading-5'>
              <FaCross size={25} />
            </div>
          </div>
          <p className='text-gray-400 mt-2 mb-5'>{churches?.length}</p>
        </div>
        <div>
          <Link href={pathname + '/new'}>
            <ButtonNew />
          </Link>
        </div>
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className='shadow-sm'>
          <ul className='divide-y divide-gray-200 dark:divide-gray-700 w-full mx-auto bg-white shadow-lg p-4 dark:rounded-b-lg dark:bg-dark-secondary'>
            {churches &&
              churches.map((church: Churches) => (
                <li className='pb-3 sm:pb-4' key={church.id}>
                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-app-bg  text-white text-2xl rounded-full flex items-center justify-center mt-2'>
                      Aviv
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate dark:text-gray-200'>
                        {church.name}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                        {church.street +
                          ', ' +
                          church.number +
                          ' - ' +
                          church.city}
                      </p>
                    </div>
                    <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark-primary'>
                      <FaEdit className='cursor-pointer mx-2' size={18} />
                      <FaTrash
                        className='cursor-pointer mx-2'
                        size={17}
                        onClick={() => handleDelete(church.id)}
                      />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Churches
