import { useState } from 'react'
import { Loading } from '../Loading'
import React from 'react'

export interface IButtonSubmit {
  value?: string
  type: 'submit' | 'reset'
  onClick?: (event: string) => void
  disabled?: boolean
  text: string
}
const ButtonSubmit: React.FC<IButtonSubmit> = ({
  onClick,
  value,
  type,
  disabled = false,
  text
}) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <button
      type={type}
      className={`p-4 text-1xl text-center border font-semibold w-full rounded border-lime-500 shadow 
                      bg-lime-500 min-w-full ${
                        isLoading
                          ? 'cursor-not-allowed opacity-85'
                          : 'hover:bg-lime-400'
                      }`}
    >
      <div> {isLoading ? <Loading /> : text}</div>
    </button>
  )
}

export default ButtonSubmit
