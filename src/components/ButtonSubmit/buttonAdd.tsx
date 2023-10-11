import { FaPlus } from 'react-icons/fa'

const ButtonNew = () => {
  return (
    <button className='flex justify-items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-sm -mt-1'>
      <FaPlus size={20} className='mr-2 my-auto' />
      <p className=''>Novo</p>
    </button>
  )
}

export default ButtonNew
