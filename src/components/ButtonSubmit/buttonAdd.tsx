import { Plus } from 'lucide-react'

const ButtonNew = () => {
  return (
    <button className="
      inline-flex items-center justify-center
      px-4 py-2 
      text-sm font-semibold text-white
      bg-green-600 hover:bg-green-700 
      dark:bg-orange-500 dark:hover:bg-orange-600
      border border-transparent
      rounded-lg shadow-sm
      transition-all duration-200 ease-in-out
      hover:shadow-md active:scale-95
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
      dark:focus:ring-offset-gray-800
      disabled:opacity-50 disabled:cursor-not-allowed
      w-full sm:w-auto
    ">
      <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
      <span className="whitespace-nowrap">Novo</span>
    </button>
  )
}

export default ButtonNew
