import React from 'react'
import { Controller } from 'react-hook-form'

type MaskFunction = (e: string) => string

export interface ITextInput {
  maxLength?: number
  placeholder?: string
  type?: 'text' | 'password' | 'number' | 'email'
  disabled?: boolean
  name: string
  control: any
  defaultValue?: string
  error?: string | undefined
  mask?: MaskFunction
}
const TextInput: React.FC<ITextInput> = ({
  maxLength,
  placeholder,
  type,
  disabled = false,
  name,
  defaultValue = '',
  control,
  error,
  mask
}) => {
  return (
    <div className='flex justify-center'>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <div className='flex flex-col w-full'>
            <input
              className='p-4 block shadow bg-gray-100 m-2 mb-3 rounded w-full max-w-md focus:outline-gray-300'
              disabled={disabled}
              maxLength={maxLength}
              placeholder={placeholder}
              type={type}
              value={mask ? mask(field.value) : field.value}
              onChange={(e) => {
                field.onChange(e.target.value)
              }}
            />
            {error && (
              <p className='text-red-400 text-sm block mt-2'>{error}</p>
            )}
          </div>
        )}
      />
    </div>
  )
}

export default TextInput
