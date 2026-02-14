import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

const Card = ({}) => {
  return (
    <div className='grid grid-cols-1 gap-4 my-4 md:grid-cols-2 lg:grid-cols-3'>
      <div className='w-full'>
        <div className='relative w-full px-4 py-6 bg-card text-card-foreground shadow-lg'>
          <p className='text-sm font-semibold text-gray-700 border-b border-gray-200 w-max dark:text-white'>
            Membros
          </p>
          <div className='flex items-end my-6 space-x-2'>
            <p className='text-5xl font-bold text-foreground'>12</p>
          </div>
          <div className='dark:text-white'>
            <div className='flex items-center justify-between pb-2 mb-2 text-sm border-b border-gray-200 sm:space-x-12'>
              <p>Reconciliaram</p>
              <div className='flex items-end text-xs'>
                34
                <span className='flex items-center'>
                  <FaArrowUp className='mx-1 text-lime-600' />
                  22%
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between pb-2 mb-2 space-x-12 text-sm border-b border-gray-200 md:space-x-24'>
              <p>Aceitaram Jesus</p>
              <div className='flex items-end text-xs'>
                13
                <span className='flex items-center'>
                  <FaArrowUp className='mx-1 text-lime-600' />
                  12%
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between space-x-12 text-sm md:space-x-24'>
              <p>Novos Membros</p>
              <div className='flex items-end text-xs'>
                45
                <span className='flex items-center'>
                  <FaArrowUp className='mx-1 text-lime-600' />
                  41%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
