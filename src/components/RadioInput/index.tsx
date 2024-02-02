import React from 'react'
import { Controller } from 'react-hook-form'

export interface PropsRadioInput extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean
  name: string
  control: any
  error?: string | undefined
  options: { value: string; label: string; checked?: boolean }[]
}
const RadioInput: React.FC<PropsRadioInput> = ({
  disabled = false,
  name,
  defaultValue = '',
  control,
  error,
  className,
  options
}) => {
  return (
    <div className='flex items-center mr-4'>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <div className='flex gap-5'>
            {options.map((option, index) => (
              <div key={index} className='flex items-center'>
                <input
                  className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
                    className || ''
                  }`}
                  disabled={disabled}
                  type='radio'
                  id={option.value}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                <label
                  htmlFor={option.value}
                  className='ml-2 text-base font-medium text-gray-900 dark:text-gray-300'
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  )
}

export default RadioInput
