import Avatar from '@/components/Avatar'
import Link from 'next/link'
import { User } from '@/domain/models/users'
import { useState } from 'react'
import { CirclePlayIcon, CircleX, Edit, EyeIcon } from 'lucide-react'

type Props = {
  member: User
  onDeactive: () => void
  onActive: () => void
  onEdit: () => void
  basePath: string
  viewCargo?: boolean
}

const MemberItem = ({
  member,
  onDeactive,
  onActive,
  onEdit,
  basePath,
  viewCargo = false
}: Props) => {
  const [disabled, setDisabled] = useState(false)
  const toggleDisabled = () => setDisabled((prev) => !prev)

  return (
    <li className='bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow mb-1'>
      <div className='flex items-start gap-4'>
        {/* Avatar fora do grid */}
        <div className='w-10 flex items-center justify-center rounded-full bg-app-bg text-white text-base'>
          <Avatar name={member.name} />
        </div>

        {/* Grid de informações */}
        <div className={`grid grid-cols-4 grid-rows-2 gap-x-2 gap-y-1 flex-1`}>
          {/* Nome */}
          <div
            className={`col-span-2 row-start-1 ${
              member.active
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-400'
            }`}
          >
            <p
              className={`text-sm font-medium uppercase truncate leading-tight`}
            >
              {member.name + ' ' + (member.active ? '' : '(Inativo)')}
            </p>
          </div>

          {/* Rede */}
          <div className='col-start-3 row-start-1 text-sm text-gray-600 dark:text-gray-400 uppercase truncate leading-tight'>
            {member.cem?.name || 'Sem rede'}
          </div>
          {viewCargo && (
            <div className='col-start-3 row-start-2 text-sm text-gray-600 dark:text-gray-400 uppercase truncate leading-tight'>
              {member.role || 'Sem rede'}
            </div>
          )}
          {/* Botões e checkbox: agora em linha */}
          <div className='flex items-center justify-end gap-3 col-start-4 row-span-2'>
            <span title='Visualizar'>
              <Link href={`${basePath}/${member._id}`}>
                <EyeIcon
                 className={`${
                  member.active
                    ? 'text-gray-900 dark:text-gray-100 cursor-pointer hover:green-blue-600 disabled'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                  size={16}
                />
              </Link>
            </span>
            <span title='Editar'>
              <Edit
                className={`${
                  member.active
                    ? 'text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 disabled'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                size={16}
                onClick={onEdit}
              />
            </span>
            {member.active ? (
              <span title='Desativar'>
                <CircleX
                  className='cursor-pointer hover:text-red-600'
                  size={16}
                  onClick={onDeactive}
                />
              </span>
            ) : (
              <span title='Ativar'>
                <CirclePlayIcon
                  className='cursor-pointer hover:text-blue-600'
                  size={16}
                  onClick={onActive}
                />
              </span>
            )}
          </div>

          {/* Email */}
          <div className='col-span-2 row-start-2 text-sm text-gray-500 dark:text-gray-400 lowercase truncate leading-tight'>
            {member.email}
          </div>

          {/* Endereço */}
          {/* <div className='col-start-3 row-start-2 text-sm text-gray-500 dark:text-gray-400 truncate leading-tight'>
            <MemberAddress address={member.address} />
          </div> */}
        </div>
      </div>
    </li>
  )
}

export default MemberItem
