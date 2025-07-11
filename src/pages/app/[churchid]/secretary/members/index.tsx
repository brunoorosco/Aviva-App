import { Suspense, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useHttpDelete, useHttpGet } from '@/hooks/api'
import MembersHeader from './MembersHeader'
import MemberItem from './MemberItem'
import { User } from '@/domain/models/users'
import Pagination from '@/components/Pagination'

const MembersWithImportExport = () => {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { churchid } = query
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)
  const limit = 8

  const { data: members } = useHttpGet<{
    data: User[]
    total: number
    page: number
    totalPages: number
  }>(`/api/protected/churches/${churchid}/users?page=${page}&limit=${limit}`)

  console.log(members)

  const handleDelete = async (id: string) => {
    await useHttpDelete({
      url: `/api/protected/churches/${churchid}/users`
    })
  }

  return (
    <div className='flex flex-col w-full max-w-4xl p-3 mx-auto rounded-lg dark:text-dark-primary'>
      <MembersHeader
        total={members?.data?.total || 0}
        pathname={pathname}
        inputFileRef={inputFileRef}
        members={members?.data.data || []}
      />

      <div className='shadow-sm'>
        <ul className='w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
          <Suspense fallback={<p>Carregando membros...</p>}>
            {members?.data?.data.map((member) => (
              <MemberItem
                key={member._id}
                member={member}
                onDelete={() => handleDelete(member._id)}
                basePath={asPath}
              />
            ))}
          </Suspense>
        </ul>

        {members?.data.totalPages && (
          <Pagination
            currentPage={page} // Página atual controlada por estado
            pageSize={limit} // Quantos itens por página
            items={members.data.total} // Total de itens disponíveis
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}

export default MembersWithImportExport
