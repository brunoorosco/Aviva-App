import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useHttpGet } from '@/hooks/api'
import EditMemberModal from '@/components/Member/EditMemberModal'
import { TReencontroComDeus } from '@/domain/models/encontroComDeus'
import ReencontroComDeusItem from '@/components/reencontroComDeus/ReencontroComDeusItem'
import ReencontroComDeusHeader from '@/components/reencontroComDeus/ReencontroComDeusHeader'

const ReencontroComDeusList = () => {
  const router = useRouter()
  const { asPath, query, isReady } = router
  const { churchid } = query
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEncontro, setSelectedEncontro] =
    useState<TReencontroComDeus | null>(null)
  const [page, setPage] = useState(1)
  const limit = 8

  if (!isReady || !churchid) return null

  const { data: reencontros, mutate: refreshMembers } = useHttpGet<{
    data: TReencontroComDeus[]
    total: number
    page: number
    totalPages: number
  }>(
    `/api/protected/churches/${churchid}/reencontroComDeus?page=${page}&limit=${limit}`
  )

  const handleEdit = (reencontro: TReencontroComDeus) => {
    setSelectedEncontro(reencontro)
    setShowEditModal(true)
  }

  return (
    <div className='flex flex-col w-full max-w-4xl px-3 py-1 mx-auto rounded-lg dark:text-dark-primary'>
      {/* {showEditModal && selectedEncontro && (
        <EditMemberModal
          member={selectedEncontro}
          onClose={() => {
            setShowEditModal(false)
            setSelectedEncontro(null)
          }}
          onUpdated={refreshMembers}
        />
      )} */}

      <div className='shadow-sm'>
        <ReencontroComDeusHeader
          pathname={router.asPath}
          inputFileRef={inputFileRef}
          encontro={reencontros?.data.data || []}
        />
        <ul className='w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
          {!reencontros ? (
            <p>Carregando reencontros...</p>
          ) : (
            reencontros?.data.data.map((reencontro: TReencontroComDeus) => (
              <ReencontroComDeusItem
                key={reencontro._id}
                reencontro={reencontro}
                onEdit={() => handleEdit(reencontro)}
                basePath={asPath}
              />
            ))
          )}
        </ul>

        {/* {encontros?.data.totalPages && (
          <Pagination
            currentPage={page}
            pageSize={limit}
            items={encontros.data.total}
            onPageChange={setPage}
          />
        )} */}
      </div>
    </div>
  )
}

export default ReencontroComDeusList
