import { FaAngleDown, FaCalendarAlt } from 'react-icons/fa'

const Calender = () => {
  return (
    <div className='flex items-center space-x-4'>
      <button className='flex items-center px-4 py-2 text-gray-400 border border-gray-300 rounded-r-full rounded-tl-sm rounded-bl-full text-md'>
        <FaCalendarAlt size={23} className='mr-1' />
        Ultimo Mês
        <FaAngleDown size={22} className='ml-1' />
      </button>
      <span className='text-sm text-gray-400'>
        Compared to oct 1- otc 30, 2020
      </span>
    </div>
  )
}

export default Calender
