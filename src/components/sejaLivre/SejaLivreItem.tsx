import Link from 'next/link'
import { TEncontroComDeus } from '@/domain/models/encontroComDeus'

type Props = {
  encontro: TEncontroComDeus
  onEdit: () => void
  basePath: string
}

const EncontroComDeusItem = ({ encontro, onEdit, basePath }: Props) => {
  // const [disabled, setDisabled] = useState(false)
  // const toggleDisabled = () => setDisabled((prev) => !prev)

  const formatDate = (dateValue: any) => {
    if (!dateValue) return ''
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    if (!(date instanceof Date) || isNaN(date.getTime())) return ''

    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  return (
    <Link href={`${basePath}/${encontro._id}`}>
      <li className='bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow mb-1'>
        <div className='flex items-start gap-4'>
          <div className='grid grid-cols-4 gap-x-2 gap-y-1 flex-1'>
            <div className='col-span-2 row-start-1'>
              <p
                className={`text-sm font-medium uppercase truncate leading-tight ${
                  encontro.data
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-400'
                }`}
              >
                {formatDate(encontro.data)}
                <p className='text-xs font-normal'>
                  Encontristas:{' '}
                  <label className='font-semibold'>
                    {encontro?.encontristas ? encontro?.encontristas.length : 0}
                  </label>
                </p>
              </p>
            </div>

            {/* <div className='flex items-center justify-end gap-3 col-start-4 row-span-2'>
              <Edit
                className='cursor-pointer hover:text-blue-600'
                size={16}
                onClick={onEdit}
              />
            </div> */}
          </div>
        </div>
      </li>
    </Link>
  )
}

export default EncontroComDeusItem
