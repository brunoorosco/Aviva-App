import Avatar from '@/components/Avatar'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import { AddressModel } from '@/domain/models/address'
import { useHttpDelete, useHttpGet } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { FaPeopleRoof } from 'react-icons/fa6'

export type TMembers = {
  _id: string
  name: string
  email: string
  birth?: Date
  image?: string
  address?: AddressModel[]
}

const Members = () => {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { churchid, cemid } = query

  const { data: members, error } = useHttpGet<TMembers[]>(
    `/api/protected/churches/${churchid}/cems/${cemid}/members`
  )

  const handleDelete = async (id: string) => {
    await useHttpDelete({
      url: `/api/protected/churches/${churchid}/cems/${id}/members`
    })
  }

  if (error) {
    return <p className="text-center text-red-500">Erro ao carregar membros.</p>
  }

  return (
    <div className="flex flex-col w-full max-w-4xl p-3 mx-auto rounded-lg dark:text-dark-primary">
      <div className="flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Membros</h2>
            <FaPeopleRoof size={24} />
          </div>
          <p className="mt-2 text-gray-400">{members?.data.length || 0}</p>
        </div>
        <Link href={`${pathname}/new`}>
          <ButtonNew />
        </Link>
      </div>

      <div className="shadow-sm">
        <ul className="w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary">
          <Suspense fallback={<p>Carregando membros...</p>}>
            {members?.data.map((member) => (
              <MemberItem
                key={member._id}
                member={member}
                onDelete={() => handleDelete(member._id)}
                basePath={asPath}
              />
            ))}
          </Suspense>
        </ul>
      </div>
    </div>
  )
}

type MemberItemProps = {
  member: TMembers
  onDelete: () => void
  basePath: string
}

const MemberItem = ({ member, onDelete, basePath }: MemberItemProps) => {
  return (
    <li className="pb-3 sm:pb-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 mt-2 text-2xl text-white rounded-full bg-app-bg">
          <Avatar name={member.name} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 uppercase truncate dark:text-gray-200">
            {member.name}
          </p>
          <p className="text-sm text-gray-500 lowercase truncate dark:text-gray-400">
            {member.email}
          </p>
          <MemberAddress address={member.address} />
        </div>
        <div className="flex items-center gap-2 text-gray-900 dark:text-dark-primary">
          <Link href={`${basePath}/${member._id}`}>
            <FaEdit className="cursor-pointer" size={18} title="Editar" />
          </Link>
          <FaTrash
            className="cursor-pointer"
            size={17}
            onClick={onDelete}
            title="Excluir"
          />
        </div>
      </div>
    </li>
  )
}

type MemberAddressProps = {
  address?: AddressModel[]
}

const MemberAddress = ({ address }: MemberAddressProps) => {
  const main = address?.[0]
  const fullAddress = main
    ? `${main.street || ''}, ${main.number || ''} - ${main.city || ''}`
    : ''

  return (
    <p className="text-sm text-gray-500 uppercase truncate dark:text-gray-400">
      {fullAddress}
    </p>
  )
}

export default Members
