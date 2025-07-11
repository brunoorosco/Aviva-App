import Avatar from '@/components/Avatar'
import Link from 'next/link'
import { FaEdit, FaTrash } from 'react-icons/fa'
import MemberAddress from './MemberAddress'
import { User } from '@/domain/models/users'

type Props = {
  member: User
  onDelete: () => void
  basePath: string
}

const MemberItem = ({ member, onDelete, basePath }: Props) => {
  return (
    <li className="bg-white dark:bg-gray-800 p-3 rounded-md shadow mb-1">
      <div className="flex items-start gap-4">
        {/* Avatar fora do grid */}
        <div className="w-12 h-10 flex items-center justify-center rounded-full bg-app-bg text-white text-base">
          <Avatar name={member.name} />
        </div>

        {/* Grid de informações com menos espaço vertical */}
        <div className="grid grid-cols-4 grid-rows-2 gap-x-2 gap-y-1 flex-1">
          {/* Nome (A - col 1 e 2, row 1) */}
          <div className="col-span-2 row-start-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase truncate leading-tight">
              {member.name}
            </p>
          </div>

          {/* Rede (B - col 3, row 1) */}
          <div className="col-start-3 row-start-1 text-sm text-gray-600 dark:text-gray-400 uppercase truncate leading-tight">
            {member.cem?.name || 'Sem rede'}
          </div>

          {/* Botões (C - col 4, row 1 + 2) */}
          <div className="flex flex-col items-end justify-center gap-1 col-start-4 row-span-2">
            <Link href={`${basePath}/${member._id}`}>
              <FaEdit className="cursor-pointer" size={16} title="Editar" />
            </Link>
            <FaTrash
              className="cursor-pointer"
              size={15}
              onClick={onDelete}
              title="Excluir"
            />
          </div>

          {/* Email (D - col 1 e 2, row 2) */}
          <div className="col-span-2 row-start-2 text-sm text-gray-500 dark:text-gray-400 lowercase truncate leading-tight">
            {member.email}
          </div>

          {/* Endereço (E - col 3, row 2) */}
          <div className="col-start-3 row-start-2 text-sm text-gray-500 dark:text-gray-400 truncate leading-tight">
            <MemberAddress address={member.address} />
          </div>
        </div>
      </div>
    </li>
  )
}

export default MemberItem
