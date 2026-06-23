import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useHttpGet } from '@/hooks/api'
import Pagination from '@/components/Pagination'
import ReencontroComDeusHeader from '@/components/reencontroComDeus/ReencontroComDeusHeader'
import { TReencontroComDeus } from '@/domain/models/encontroComDeus'
import ReencontroComDeusItem from '@/components/reencontroComDeus/ReencontroComDeusItem'
import { EditReencontroModal } from '@/components/reencontroComDeus/EditReencontroModal'

const ReencontroComDeusList = () => {
  const router = useRouter()
  const { asPath, query, isReady } = router
  const { churchid } = query
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReencontro, setSelectedReencontro] =
    useState<TReencontroComDeus | null>(null)
  const [page, setPage] = useState(1)
  const limit = 8

  if (!isReady || !churchid) return null

  const { data: reencontros, mutate: refreshReencontros } = useHttpGet<{
    data: TReencontroComDeus[]
    total: number
    page: number
    totalPages: number
  }>(
    `/api/protected/churches/${churchid}/reencontroComDeus?page=${page}&limit=${limit}`
  )

  const handleEdit = (batismo: TReencontroComDeus) => {
    setSelectedReencontro(batismo)
    setShowEditModal(true)
  }

  return (
    <div className='flex flex-col w-full max-w-4xl px-3 py-1 mx-auto rounded-lg mt-8 dark:text-dark-primary'>
      {showEditModal && selectedReencontro && (
        <EditReencontroModal
          reencontro={selectedReencontro}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => refreshReencontros()} // Atualiza a lista após editar
        />
      )}

      <div className='shadow-sm'>
        <ReencontroComDeusHeader
          pathname={asPath}
          inputFileRef={inputFileRef}
          reencontro={reencontros?.data.data || []}
          onImportSuccess={refreshReencontros}
        />
        <ul className='w-full pt-4 bg-gray-50 divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-background'>
          {!reencontros ? (
            <p>Carregando reencontros...</p>
          ) : (
            reencontros?.data.data.map((reencontro: TReencontroComDeus) => (
              <ReencontroComDeusItem
                key={reencontro._id}
                reencontro={reencontro}
                onEdit={() => handleEdit(reencontro)}
                basePath={asPath}
                onToggleSuccess={() => refreshReencontros()}
              />
            ))
          )}
        </ul>

        {reencontros?.data.totalPages ? (
          <Pagination
            currentPage={page}
            pageSize={limit}
            items={reencontros.data.total}
            onPageChange={setPage}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default ReencontroComDeusList
