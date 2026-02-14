'use client'

import { useState } from 'react'
import { FaPeopleRoof } from 'react-icons/fa6'
import { User } from '@/domain/models/users'
import ImportButton from './ImportButton'
import ExportButton from './ExportButton'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import EditMemberModal from './EditMemberModal'

type Props = {
  total: number
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  members: User[]
  churchId: string
  search: string
  totalAtivo?: number
  totalInativo?: number
  setSearch: (value: string) => void
}

const MembersHeader = ({
  total,
  inputFileRef,
  members,
  search,
  setSearch,
  totalAtivo,
  totalInativo
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='px-3 pt-5 mt-2 w-full bg-card text-card-foreground rounded-t-lg'>
      {/* Topo: Título + Botões */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2'>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>Membros</h2>
          <FaPeopleRoof size={24} />
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <div className='flex gap-2'>
            <ExportButton members={members} />
            <ImportButton inputFileRef={inputFileRef} />
          </div>
          <Button onClick={() => setIsOpen(true)}>Novo Membro</Button>
        </div>
      </div>

      {/* Totais + Busca */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
        {/* Totais */}
        <div className='flex flex-wrap gap-5 text-gray-400'>
          <p>
            Total de Membros:{' '}
            <span className='text-gray-700 font-semibold'>{total}</span>
          </p>
          <p>
            Ativos:{' '}
            <span className='text-gray-700 font-semibold'>{totalAtivo}</span>
          </p>
          <p>
            Inativos:{' '}
            <span className='text-gray-700 font-semibold'>{totalInativo}</span>
          </p>
        </div>

        {/* Input de busca */}
        <div className='w-full sm:w-1/3'>
          <Input
            placeholder='Pesquisar por nome'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete='off'
          />
        </div>
      </div>

      {/* Modal Novo Membro */}
      {isOpen && (
        <EditMemberModal
          onClose={() => setIsOpen(false)}
          onUpdated={() => {}}
        />
      )}
    </div>
  )
}

export default MembersHeader
