import React from 'react'

type MaskFunction = (e: string) => string

interface ITextInput extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  error?: string
  mask?: MaskFunction
  field?: any // do RHF Controller
}

const TextInput: React.FC<ITextInput> = ({
  field,
  name,
  error,
  mask,
  ...rest
}) => {
  return (
    <div className="flex flex-col w-full">
      <input
        {...rest}
        {...field}
        value={field?.value || ''}
        onChange={(e) => field?.onChange(mask ? mask(e.target.value) : e.target.value)}
        className="appearance-none block w-full p-4 mb-2 bg-gray-200 rounded shadow-md placeholder:text-gray-500 focus:outline-zinc-400 dark:bg-gray-600 dark:text-dark-primary"
      />
      {error && <p className="block text-sm text-red-400">{error}</p>}
    </div>
  )
}

export default TextInput
