import Link from 'next/link'
import { useState } from 'react'
import { Edit } from 'lucide-react'
import { CasaDePaz, CasaDePazModel } from '@/domain/models/casaDePaz'

type Props = {
  casasDePaz: CasaDePazModel
  onEdit: () => void
  basePath: string
}

const CasadePazItem = ({ casasDePaz, onEdit, basePath }: Props) => {
  const [disabled, setDisabled] = useState(false)
  const toggleDisabled = () => setDisabled((prev) => !prev)

  const formatDate = (dateValue: any) => {
    if (!dateValue) return ''

    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue

    if (!(date instanceof Date) || isNaN(date.getTime())) return ''

    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  return (
    <Link href={`${basePath}/${casasDePaz._id}`}>
      <li className='bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow mb-1'>
        <div className='flex items-start gap-4'>
          {/* Grid de informações */}
          <div className='grid grid-cols-4 gap-x-2 gap-y-1 flex-1'>
            {/* Nome */}
            <div className='col-span-2 row-start-1'>
              <p
                className={`text-sm font-medium uppercase truncate leading-tight ${
                  casasDePaz.data_inicial
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-400'
                }`}
              >
                {formatDate(casasDePaz.data_inicial)}
                <p className='text-xs font-normal'>
                  Casa de Paz realizadas: {casasDePaz.casas.length}
                </p>
              </p>
            </div>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default CasadePazItem
