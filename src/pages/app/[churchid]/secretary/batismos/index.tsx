import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useHttpGet, useHttpPatch } from '@/hooks/api'
import BatismoItem from './BatismoItem'
import Pagination from '@/components/Pagination'
import EditMemberModal from '@/components/Member/EditMemberModal'
import { baptism } from '@/domain/models/baptism'
import BatismoHeader from './BatismoHeader'

const BatismoList = () => {
  const router = useRouter()
  const { asPath, query, isReady } = router
  const { churchid } = query
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBatismo, setSelectedBatismo] = useState<baptism | null>(null)
  const [page, setPage] = useState(1)
  const limit = 8

  if (!isReady || !churchid) return null

  const { data: batismos, mutate: refreshMembers } = useHttpGet<{
    data: baptism[]
    total: number
    page: number
    totalPages: number
  }>(`/api/protected/churches/${churchid}/batismo?page=${page}&limit=${limit}`)

  const handleDesactive = async (id: string) => {
    await useHttpPatch({
      url: `/api/protected/churches/${churchid}/batismo/${id}`,
      data: { id, active: false }
    })
  }

  const handleActive = async (id: string) => {
    await useHttpPatch({
      url: `/api/protected/churches/${churchid}/batismo/${id}`,
      data: { id, active: true }
    })
  }

  const handleEdit = (batismo: baptism) => {
    setSelectedBatismo(batismo)
    setShowEditModal(true)
  }

  return (
    <div className='flex flex-col w-full max-w-4xl px-3 py-1 mx-auto rounded-lg dark:text-dark-primary'>
      {showEditModal && selectedBatismo && (
        <EditMemberModal
          member={selectedBatismo}
          onClose={() => {
            setShowEditModal(false)
            setSelectedBatismo(null)
          }}
          onUpdated={refreshMembers}
        />
      )}

      <div className='shadow-sm'>
        <BatismoHeader
          total={batismos?.data?.total || 0}
          pathname={""}
          inputFileRef={inputFileRef}
          batismo={batismos?.data.data || []}
        />
        <ul className='w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
          {!batismos ? (
            <p>Carregando batismos...</p>
          ) : (
            batismos?.data.data.map((bat:baptism) => (
              <BatismoItem
                key={bat._id}
                batismos={bat}
                onEdit={() => handleEdit(bat)}
                onDeactive={() => handleDesactive(bat._id)}
                onActive={() => handleActive(bat._id)}
                basePath={asPath}
              />
            ))
          )}
        </ul>

        {batismos?.data.totalPages && (
          <Pagination
            currentPage={page}
            pageSize={limit}
            items={batismos.data.total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}

export default BatismoList
