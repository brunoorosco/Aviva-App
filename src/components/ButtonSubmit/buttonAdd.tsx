import { FaPlus } from 'react-icons/fa'

const ButtonNew = () => {
  return (
    <button className='flex justify-items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full -mt-1'>
      <FaPlus size={20} className='mr-2 my-auto' />
      <p className=''>Novo</p>
    </button>
  )
}

export default ButtonNew
