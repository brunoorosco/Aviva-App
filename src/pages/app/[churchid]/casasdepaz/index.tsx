'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useHttpGet } from '@/hooks/api'
import Pagination from '@/components/Pagination'
import EditMemberModal from '@/components/Member/EditMemberModal'
import CasadePazHeader from './CasadePazHeader'
import CasadePazItem from './CasadePazItem'
import { CasaDePazModel } from '@/domain/models/casaDePaz'

const CasaDePazList = () => {
  const router = useRouter()
  const { asPath, query, isReady } = router
  const { churchid } = query
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBatismo, setSelectedBatismo] = useState<CasaDePazModel | null>(
    null
  )
  const [page, setPage] = useState(1)
  const limit = 8

  if (!isReady || !churchid) return null

  const { data: casasDePaz, mutate: refreshMembers } = useHttpGet<{
    total: number
    page: number
    data: CasaDePazModel[]
    totalPages: number
  }>(
    `/api/protected/churches/${churchid}/casasdepaz?page=${page}&limit=${limit}`
  )

  const handleEdit = (casaDePaz: CasaDePazModel) => {
    setSelectedBatismo(casaDePaz)
    setShowEditModal(true)
  }

  return (
    <div className='flex flex-col w-full max-w-4xl px-3 py-1 mx-auto rounded-lg dark:text-dark-primary'>
      {/* Botão Voltar */}
      {/* <div className='mb-3'>
        <Button
          variant='ghost'
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900'
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
          Voltar
        </Button>
      </div> */}

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
        {casasDePaz && (
          <CasadePazHeader
            pathname={asPath}
            inputFileRef={inputFileRef}
            casasdepaz={casasDePaz?.data.data}
          />
        )}

        {!casasDePaz ? (
          <div className='w-full p-4 bg-white shadow-lg dark:rounded-b-lg dark:bg-dark-secondary'>
            <p>Carregando Casas de Paz...</p>
          </div>
        ) : (
          <ul className='w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary'>
            {casasDePaz.data.data.length === 0 ? (
              <li className='text-center py-4 text-gray-500'>
                Nenhuma Casa de Paz encontrada.
              </li>
            ) : (
              casasDePaz.data.data?.map((grupo: CasaDePazModel) => (
                <CasadePazItem
                  key={grupo._id}
                  casasDePaz={grupo}
                  onEdit={() => handleEdit(grupo)}
                  basePath={asPath}
                />
              ))
            )}
          </ul>
        )}

        {casasDePaz?.data.totalPages ? (
          <Pagination
            currentPage={page}
            pageSize={limit}
            items={casasDePaz.data.total}
            onPageChange={setPage}
          />
        ):''}
      </div>
    </div>
  )
}

export default CasaDePazList
