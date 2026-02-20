'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useHttpGet } from '@/hooks/api'
import BatismoItem from '@/components/batismo/BatismoItem'
import Pagination from '@/components/Pagination'
import EditMemberModal from '@/components/Member/EditMemberModal'
import { baptism } from '@/domain/models/baptism'
import BatismoHeader from '@/components/batismo/BatismoHeader'

const BatismoList = () => {
  const router = useRouter()
  const { asPath, query, isReady } = router
  const { churchid } = query
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBatismo, setSelectedBatismo] = useState<baptism | null>(null)
  const [page, setPage] = useState(1)
  const limit = 8

  if (!isReady || !churchid) return null

  const { data: batismos, mutate: refreshMembers } = useHttpGet<{
    total: number
    page: number
    data: baptism[]
    totalPages: number
  }>(`/api/protected/churches/${churchid}/batismo?page=${page}&limit=${limit}`)

  const handleEdit = (batismo: baptism) => {
    setSelectedBatismo(batismo)
    setShowEditModal(true)
  }

  return (
    <div className='flex flex-col w-full max-w-4xl px-3 py-1 mx-auto mt-10 rounded-lg dark:text-dark-primary'>
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
          pathname={asPath}
          inputFileRef={inputFileRef}
          batismo={batismos?.data.data || []}
        />
        <ul className='w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
          {!batismos ? (
            <div className='w-full p-4 bg-white shadow-lg dark:rounded-b-lg dark:bg-dark-secondary'>
              <p>Carregando batismos...</p>
            </div>
          ) : batismos.data.data.length === 0 ? (
            <li className='text-center py-4 text-gray-500'>
              Nenhum batismo encontrado.
            </li>
          ) : (
            batismos.data.data.map((bat: baptism) => (
              <BatismoItem
                key={bat._id}
                batismos={bat}
                onEdit={() => handleEdit(bat)}
                basePath={asPath}
              />
            ))
          )}
        </ul>

        {batismos?.data.totalPages ? (
          <Pagination
            currentPage={page}
            pageSize={limit}
            items={batismos.data.total}
            onPageChange={setPage}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default BatismoList
