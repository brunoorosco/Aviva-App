'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaPeopleRoof } from 'react-icons/fa6'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import { User } from '@/domain/models/users'
import ImportButton from './ImportButton'
import ExportButton from './ExportButton'
import { Input } from '../ui/input'
import useSWR from 'swr'
import axios from 'axios'

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

// fetcher padrão para o SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const MembersHeader = ({
  total,
  pathname,
  inputFileRef,
  members,
  search,
  setSearch,
  totalAtivo,
  totalInativo
}: Props) => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

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
          <Link href={`${pathname}/new`}>
            <ButtonNew />
          </Link>
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
    </div>
  )
}

export default MembersHeader
