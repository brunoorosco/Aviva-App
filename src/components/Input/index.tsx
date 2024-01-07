import React from 'react'
import { Controller } from 'react-hook-form'

type MaskFunction = (e: string) => string

export interface ITextInput extends React.HTMLProps<HTMLInputElement> {
  maxLength?: number
  disabled?: boolean
  name: string
  control: any
  defaultValue?: string
  error?: string | undefined
  placeholder?: string
  mask?: MaskFunction
}
const TextInput: React.FC<ITextInput> = ({
  maxLength,
  disabled = false,
  name,
  defaultValue = '',
  control,
  error,
  placeholder,
  type,
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
              className='block w-full p-4 mb-3 bg-gray-200 rounded shadow-md placeholder:text-gray-500 focus:outline-zinc-400 dark:bg-gray-600 dark:text-dark-primary'
              disabled={disabled}
              maxLength={maxLength}
              type={type}
              placeholder={placeholder}
              value={mask ? mask(field.value) : field.value}
              onChange={(e) => {
                field.onChange(e.target.value)
              }}
            />
            {error && (
              <p className='block mt-2 text-sm text-red-400'>{error}</p>
            )}
          </div>
        )}
      />
    </div>
  )
}

export default TextInput
