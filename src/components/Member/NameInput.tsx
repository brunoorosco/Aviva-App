'use client'

import { useState, useEffect } from 'react'
import { Controller, Control } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { useMembers } from '../../pages/app/[churchid]/secretary/members/useMembers'

type Member = {
  _id: string
  name: string
}

interface Props {
  control: Control<any>
  churchId: string
}

function NameInput({ control, churchId }: Props) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [showDropdown, setShowDropdown] = useState(false)
  const { members, isLoading } = useMembers(churchId, debouncedQuery)
  // 🔹 debounce pra evitar muitas chamadas
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500)
    return () => clearTimeout(handler)
  }, [query])

  // 🔹 controla abertura do dropdown
  useEffect(() => {
    if (members && members.length > 0) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }, [members])

  return (
    <div className='relative w-full'>
      <Controller
        name='name'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            {...field}
            placeholder='Nome Completo'
            className='uppercase w-full'
            value={query}
            autoComplete='new-password'
            onChange={(e) => {
              setQuery(e.target.value)
              field.onChange(e.target.value)
            }}
          />
        )}
      />

      {/* Dropdown */}
      {showDropdown && members && (
        <ul className='absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-auto'>
          {members?.map((member) => (
            <li
              key={member?._id}
              className='p-2 cursor-pointer hover:bg-gray-100'
              onClick={() => {
                setQuery(member.name)
                setShowDropdown(false)
              }}
            >
              {member.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NameInput
