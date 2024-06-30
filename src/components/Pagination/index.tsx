import React from 'react'

interface PaginationProps {
  items: number // Número total de itens
  pageSize: number // Tamanho da página
  currentPage: string // Página atual
  onPageChange: (page: number) => void // Função para mudar de página
}

const Pagination: React.FC<PaginationProps> = ({
  items,
  pageSize,
  currentPage,
  onPageChange
}) => {
  const pagesCount = Math.ceil(items / pageSize)
  if (pagesCount === 1) return null
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1)

  return (
    <div className='container px-4 mx-auto mt-4'>
      <ul className='flex items-center justify-center list-none'>
        {pages.map((page) => (
          <li
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex justify-center items-center w-8 h-8 border border-gray-300 rounded-md  ml-2 ${
              page === +currentPage ? 'bg-gray-400 disabled' : 'cursor-pointer'
            }`}
          >
            {page}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Pagination
