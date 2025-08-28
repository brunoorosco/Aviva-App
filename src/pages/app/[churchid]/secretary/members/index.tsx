import { Suspense, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useHttpGet, useHttpPatch } from '@/hooks/api'
import MemberItem from '../../../../../components/Member/MemberItem'
import { User } from '@/domain/models/users'
import Pagination from '@/components/Pagination'
import EditMemberModal from '@/components/Member/EditMemberModal'
import MembersHeader from '@/components/Member/MembersHeader'

const MembersWithImportExport = () => {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { churchid } = query
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<User | null>(null)

  const [page, setPage] = useState(1)
  const limit = 8

  const { data: members, mutate: refreshMembers } = useHttpGet<{
    data: User[]
    total: number
    page: number
    totalPages: number
  }>(`/api/protected/churches/${churchid}/users?page=${page}&limit=${limit}`)

  const handleDesactive = async (id: string) => {
    await useHttpPatch({
      url: `/api/protected/churches/${churchid}/users/${id}`,
      data: {
        id,
        active: false
      }
    })
  }

  const handleActive = async (id: string) => {
    await useHttpPatch({
      url: `/api/protected/churches/${churchid}/users/${id}`,
      data: {
        id,
        active: true
      }
    })
  }
  const handleEdit = (member: User) => {
    setSelectedMember(member)
    setShowEditModal(true)
  }

  return (
    <div className='flex flex-col w-full max-w-4xl px-3 py-1 mx-auto rounded-lg dark:text-dark-primary'>
      {showEditModal && (
        <EditMemberModal
          member={selectedMember}
          onClose={() => {
            setShowEditModal(false)
            setSelectedMember(null)
          }}
          onUpdated={refreshMembers}
        />
      )}
      <MembersHeader
        total={members?.data?.total || 0}
        pathname={asPath}
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
                onEdit={() => handleEdit(member)}
                onDeactive={() => handleDesactive(member._id)}
                onActive={() => handleActive(member._id)}
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
