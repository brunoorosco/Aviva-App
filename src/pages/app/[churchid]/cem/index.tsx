import Skeleton from '@/components/skeleton'
import { useHttpGet } from '@/hooks/api'
import { CEM } from '@prisma/client'
import { FaEdit } from 'react-icons/fa'

const Cem = () => {
  const { data: churches, error, isLoading } = useHttpGet<CEM[]>('/api/cem')
  if (isLoading) {
    return <Skeleton />
  }

  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>
  }

  return (
    <ul className='max-w-md divide-y divide-gray-200 dark:divide-gray-700'>
      {churches &&
        churches.map((church: CEM) => (
          <li className='pb-3 sm:pb-4'>
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 bg-app-bg  text-white text-2xl rounded-full flex items-center justify-center'>
                Aviv
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>
                  {church.name}
                </p>
                <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                  {church.street + ', ' + church.number + ' - ' + church.city}
                </p>
              </div>
              <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white'>
                <FaEdit className='cursor-pointer' size={20} />
              </div>
            </div>
          </li>
        ))}
    </ul>
  )
}

export default Cem
