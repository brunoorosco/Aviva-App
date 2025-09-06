'use client'

import { useState, useEffect } from 'react'
import { FaPeopleRoof } from 'react-icons/fa6'
import { User } from '@/domain/models/users'
import ImportButton from './ImportButton'
import ExportButton from './ExportButton'
import { Input } from '../ui/input'

// exemplo de modal (pode trocar pelo seu componente real de modal)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import MemberModal from './EditMemberModal'
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
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // debounce da query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500)
    return () => clearTimeout(handler)
  }, [query])

  return (
    <div className='px-3 pt-5 mt-2 w-full bg-white rounded-t-lg dark:bg-dark-secondary'>
      <div className='flex justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>Membros</h2>
          <FaPeopleRoof size={24} />
        </div>
        <div className='flex gap-2 h-10'>
          <ExportButton members={members} />
          <ImportButton inputFileRef={inputFileRef} />
          {/* Botão abre modal */}
          {/* <ButtonNew onClick={() => setIsOpen(true)} /> */}
          <Button onClick={() => setIsOpen(true)}>Novo Membro</Button>
        </div>
      </div>
      <div className='flex w-full justify-between'>
        <div className='flex gap-5 mt-2 text-gray-400'>
          <p>
            Total de Membros:{' '}
            <label className='text-gray-700 font-semibold'>{total}</label>
          </p>
          <p>
            Ativos:{' '}
            <label className='text-gray-700 font-semibold'>{totalAtivo}</label>
          </p>
          <p>
            Inativos:{' '}
            <label className='text-gray-700 font-semibold'>
              {totalInativo}
            </label>
          </p>
        </div>

        {/* Input de busca */}
        <div className='flex w-1/2 mb-1'>
          <Input
            placeholder='Pesquisar por nome'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete='off'
          />
        </div>
      </div>

      {isOpen && (
        <EditMemberModal
          onClose={() => {
            setIsOpen(false)
          }}
          onUpdated={() => {}}
        />
      )}
    </div>
  )
}

export default MembersHeader
