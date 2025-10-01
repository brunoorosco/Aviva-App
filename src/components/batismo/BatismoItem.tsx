import Link from 'next/link'
import { useState } from 'react'
import {  PrinterIcon } from 'lucide-react'
import { baptism } from '@/domain/models/baptism'
import { gerarCertificados } from '../../lib/pdf'

type Props = {
  batismos: baptism
  onEdit: () => void
  basePath: string
}

const BatismoItem = ({ batismos, onEdit, basePath }: Props) => {
  const [disabled, setDisabled] = useState(false)
  const toggleDisabled = () => setDisabled((prev) => !prev)

  const formatDate = (dateValue: any) => {
    if (!dateValue) return ''

    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    if (!(date instanceof Date) || isNaN(date.getTime())) return ''
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  return (
    <Link href={`${basePath}/${batismos._id}`}>
      <li className='bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow mb-1 flex gap-3 container'>
        <div className='flex items-start gap-4 w-1/3'>
          {/* Grid de informações */}
          <div className='grid grid-cols-4 gap-x-2 gap-y-1 flex-1'>
            {/* Nome */}
            <div className='col-span-2 row-start-1'>
              <p
                className={`text-sm font-medium uppercase truncate leading-tight ${
                  batismos.data
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-400'
                }`}
              >
                {formatDate(batismos.data)}
                <p className='text-xs font-normal'>
                  Batizandos: {batismos.batizandos.length}
                </p>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            gerarCertificados(batismos.churchId, batismos)
          }}
          className='flex items-center gap-1 text-blue-600 hover:underline'
        >
          <PrinterIcon className='w-4' />
          Imprimir Todos
        </button>
      </li>
    </Link>
  )
}

export default BatismoItem
