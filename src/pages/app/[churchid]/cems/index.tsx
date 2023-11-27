import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import Toast from '@/components/Toast'
// import Skeleton from '@/components/Skeleton'
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
    isLoading,
    mutate
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
    Toast.showSuccess('Registro Excluído com Sucesso!')
    await mutate()
  }

  return (
    <div className='flex flex-col content-center w-full max-w-lg p-3 mx-auto rounded-lg dark:text-dark-primary'>
      <Suspense fallback={'teste loading'}>
        {/* {isLoading ? (
        <Skeleton />
      ) : (
        <> */}
        <div className='flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary'>
          <div className=''>
            <div className='flex justify-between'>
              <p className='mr-3 text-2xl font-bold leading-5'>Nossas CEM</p>
              <div className='leading-5'>
                <GiMeepleGroup size={24} />
              </div>
            </div>
            <p className='mt-2 mb-5 text-gray-400'>{cems?.length}</p>
          </div>
          <div>
            <Link href={'../' + churchId + '/cems/new'}>
              <ButtonNew />
            </Link>
          </div>
        </div>

        <div className='shadow-sm'>
          <ul className='w-full p-4 mx-auto bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
            {cems &&
              cems.map((cem: CEM) => (
                <li className='pb-3 sm:pb-4' key={cem.id}>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center justify-center w-12 h-12 mt-2 text-2xl text-white rounded-full bg-app-bg'>
                      Aviv
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate dark:text-gray-200'>
                        {cem.name}
                      </p>
                      <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                        {cem.street + ', ' + cem.number + ' - ' + cem.city}
                      </p>
                    </div>
                    <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark-primary'>
                      <FaEdit className='mx-2 cursor-pointer' size={18} />
                      <FaTrash
                        className='mx-2 cursor-pointer'
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
