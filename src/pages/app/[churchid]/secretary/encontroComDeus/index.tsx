import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useHttpGet } from '@/hooks/api'
import Pagination from '@/components/Pagination'
import EditMemberModal from '@/components/Member/EditMemberModal'
import EncontroComDeusHeader from '@/components/encontroComDeus/EncontroComDeusHeader'
import { TEncontroComDeus } from '@/domain/models/encontroComDeus'
import EncontroComDeusItem from '@/components/encontroComDeus/EncontroComDeusItem'

const EncontroComDeusList = () => {
  const router = useRouter()
  const { asPath, query, isReady } = router
  const { churchid } = query
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEncontro, setSelectedEncontro] =
    useState<TEncontroComDeus | null>(null)
  const [page, setPage] = useState(1)
  const limit = 8

  if (!isReady || !churchid) return null

  const { data: encontros, mutate: refreshMembers } = useHttpGet<{
    data: TEncontroComDeus[]
    total: number
    page: number
    totalPages: number
  }>(
    `/api/protected/churches/${churchid}/encontroComDeus?page=${page}&limit=${limit}`
  )

  const handleEdit = (batismo: TEncontroComDeus) => {
    setSelectedEncontro(batismo)
    setShowEditModal(true)
  }

  return (
    <div className='flex flex-col w-full max-w-4xl px-3 py-1 mx-auto rounded-lg dark:text-dark-primary'>
      {showEditModal && selectedEncontro && (
        <EditMemberModal
          member={selectedEncontro}
          onClose={() => {
            setShowEditModal(false)
            setSelectedEncontro(null)
          }}
          onUpdated={refreshMembers}
        />
      )}

      <div className='shadow-sm'>
        <EncontroComDeusHeader
          pathname={asPath}
          inputFileRef={inputFileRef}
          encontro={encontros?.data.data || []}
        />
        <ul className='w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
          {!encontros ? (
            <p>Carregando encontros...</p>
          ) : (
            encontros?.data.data.map((encontro: TEncontroComDeus) => (
              <EncontroComDeusItem
                key={encontro._id}
                encontro={encontro}
                onEdit={() => handleEdit(encontro)}
                basePath={asPath}
              />
            ))
          )}
        </ul>

        {encontros?.data.totalPages ? (
          <Pagination
            currentPage={page}
            pageSize={limit}
            items={encontros.data.total}
            onPageChange={setPage}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default EncontroComDeusList
