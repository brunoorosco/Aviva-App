export default function SkeletonDashboard() {
  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>
          Dashboard da Igreja
        </h1>

        {/* Skeletons para os cards de resumo */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className='bg-white p-4 md:p-6 rounded-lg shadow animate-pulse'
            >
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-3'></div>
              <div className='h-8 bg-gray-300 rounded w-1/2'></div>
            </div>
          ))}
        </div>

        {/* Skeletons para os cards de células */}
        <h2 className='text-xl md:text-2xl font-bold text-gray-700 mb-4 md:mb-6'>
          Células da Igreja
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className='bg-white rounded-lg shadow-md p-4 animate-pulse'
            >
              <div className='h-5 bg-gray-300 rounded w-1/2 mb-3'></div>
              <div className='grid grid-cols-3 gap-2 mb-4'>
                <div className='h-4 bg-gray-200 rounded'></div>
                <div className='h-4 bg-gray-200 rounded'></div>
                <div className='h-4 bg-gray-200 rounded'></div>
              </div>
              <div className='h-40 bg-gray-200 rounded mb-4'></div>
              <div className='h-4 bg-gray-300 rounded w-2/3 mb-2'></div>
              <div className='flex gap-2 flex-wrap'>
                <div className='h-5 bg-gray-200 rounded-full w-24'></div>
                <div className='h-5 bg-gray-200 rounded-full w-16'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
