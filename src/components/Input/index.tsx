import React from 'react'

export interface ITextInput {
  maxLength?: number
  placeholder?: string
  value?: string
  type?: 'text' | 'password' | 'number' | 'email'
  onChange?: (event: string) => void
  onBlur?: () => void
  disabled?: boolean
  name: string
}
const TextInput: React.FC<ITextInput> = ({
  maxLength,
  placeholder,
  onChange,
  value,
  type,
  disabled = false,
  onBlur,
  name
}) => {
  return (
    <div className="flex justify-center">
      <input
        name={name}
        className="p-4 block shadow bg-gray-100 my-2 rounded w-full max-w-md m-2"
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        value={value}
        type={type}
        onBlur={onBlur}
      />
    </div>
  )
}

export default TextInput
