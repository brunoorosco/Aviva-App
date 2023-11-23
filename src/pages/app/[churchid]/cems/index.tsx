import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import Skeleton from '@/components/Skeleton'
import { useHttpDelete, useHttpGet } from '@/hooks/api'
import { CEM } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { GiMeepleGroup } from 'react-icons/gi'

const Cem = () => {
  const router = useRouter()
  const churchId = router.query?.churchid
  const { data: session } = useSession()
  const {
    data: cems,
    error,
    isLoading
  } = useHttpGet<CEM[]>(
    `/api/protected/churches/${session?.user.churchId}/cems`
  )

  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>
  }
  const handleDelete = async (id: string) => {
    const response = await useHttpDelete({
      url: `/api/protected/churches/${session?.user.churchId}/cems/${id}`
    })
  }

  return (
    <div className='content-center mx-auto flex flex-col w-full p-3 max-w-lg rounded-lg dark:text-dark-primary'>
      <Suspense fallback={'teste loading'}>
        {/* {isLoading ? (
        <Skeleton />
      ) : (
        <> */}
        <div className='flex justify-between mt-2 bg-white px-3 pt-5 rounded-t-lg dark:bg-dark-secondary'>
          <div className=''>
            <div className='flex justify-between'>
              <p className='leading-5 text-2xl font-bold mr-3'>Nossas CEM</p>
              <div className='leading-5'>
                <GiMeepleGroup size={24} />
              </div>
            </div>
            <p className='text-gray-400 mt-2 mb-5'>{cems?.length}</p>
          </div>
          <div>
            <Link href={'../' + churchId + '/cems/new'}>
              <ButtonNew />
            </Link>
          </div>
        </div>

        <div className='shadow-sm'>
          <ul className='divide-y divide-gray-200 dark:divide-gray-700 w-full mx-auto bg-white shadow-lg p-4 dark:rounded-b-lg dark:bg-dark-secondary'>
            {cems &&
              cems.map((cem: CEM) => (
                <li className='pb-3 sm:pb-4' key={cem.id}>
                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-app-bg  text-white text-2xl rounded-full flex items-center justify-center mt-2'>
                      Aviv
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate dark:text-gray-200'>
                        {cem.name}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                        {cem.street + ', ' + cem.number + ' - ' + cem.city}
                      </p>
                    </div>
                    <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark-primary'>
                      <FaEdit className='cursor-pointer mx-2' size={18} />
                      <FaTrash
                        className='cursor-pointer mx-2'
                        size={17}
                        onClick={() => handleDelete(cem.id)}
                      />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </Suspense>
      {/* </>
      )} */}
    </div>
  )
}

export default Cem
