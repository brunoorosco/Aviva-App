import Avatar from '@/components/Avatar'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import { AddressModel } from '@/domain/models/address'
import { useHttpDelete, useHttpGet } from '@/hooks/api'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Suspense, useRef } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { FaPeopleRoof } from 'react-icons/fa6'
import * as XLSX from 'xlsx'

export type TMembers = {
  _id: string
  name: string
  email: string
  birth?: Date
  image?: string
  network?: string
  address?: AddressModel[]
}

const MembersWithImportExport = () => {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { churchid, cemid } = query
  const inputFileRef = useRef<HTMLInputElement>(null)

  const { data: members, error } = useHttpGet<TMembers[]>(
    `/api/protected/churches/${churchid}/users`
  )

  const handleDelete = async (id: string) => {
    await useHttpDelete({
      url: `/api/protected/churches/${churchid}/users`
    })
  }

  const handleExport = () => {
    if (!members?.data) return

    const exportData = members.data.map((m) => ({
      Nome: m.name,
      Email: m.email,
      Rede: m.network ?? '',
      Rua: m.address?.[0]?.street ?? '',
      Número: m.address?.[0]?.number ?? '',
      Cidade: m.address?.[0]?.city ?? ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Membros')
    XLSX.writeFile(workbook, 'membros.xlsx')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const json = XLSX.utils.sheet_to_json(sheet)

    console.log('Membros importados:', json)
    // Aqui você pode enviar os dados para o backend via POST
  }

  return (
    <div className='flex flex-col w-full max-w-4xl p-3 mx-auto rounded-lg dark:text-dark-primary'>
      <div className='flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary'>
        <div>
          <div className='flex items-center gap-2'>
            <h2 className='text-2xl font-bold'>Membros</h2>
            <FaPeopleRoof size={24} />
          </div>
          <p className='mt-2 text-gray-400'>{members?.data.length || 0}</p>
        </div>
        <div className='flex gap-2'>
          <button
            className='flex justify-items-center h-10 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-sm -mt-1'
            onClick={handleExport}
          >
            Exportar Membros
          </button>

          <button
            className='flex justify-items-center h-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-sm -mt-1'
            onClick={() => inputFileRef.current?.click()}
          >
            Importar Membros
          </button>
          <input
            ref={inputFileRef}
            type='file'
            accept='.xlsx,.xls'
            className='hidden'
            onChange={handleImport}
          />
          <Link href={`${pathname}/new`}>
            <ButtonNew />
          </Link>
        </div>
      </div>

      <div className='shadow-sm'>
        <ul className='w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
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
    <li className='pb-3 sm:pb-4'>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center justify-center w-12 h-12 mt-2 text-2xl text-white rounded-full bg-app-bg'>
          <Avatar name={member.name} />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-900 uppercase truncate dark:text-gray-200'>
            {member.name}
          </p>
          <p className='text-sm text-gray-500 lowercase truncate dark:text-gray-400'>
            {member.email}
          </p>
          <p className='text-sm text-gray-500 uppercase dark:text-gray-400'>
            {member.network || 'Sem rede'}
          </p>
          <MemberAddress address={member.address} />
        </div>
        <div className='flex items-center gap-2 text-gray-900 dark:text-dark-primary'>
          <Link href={`${basePath}/${member._id}`}>
            <FaEdit className='cursor-pointer' size={18} title='Editar' />
          </Link>
          <FaTrash
            className='cursor-pointer'
            size={17}
            onClick={onDelete}
            title='Excluir'
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
    <p className='text-sm text-gray-500 uppercase truncate dark:text-gray-400'>
      {fullAddress}
    </p>
  )
}

export default MembersWithImportExport
