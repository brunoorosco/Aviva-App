import { useState } from 'react'
import { Loading } from '../Loading'
import React from 'react'

export interface IButtonSubmit {
  value?: string
  type: 'submit' | 'reset'
  onClick?: (event: string) => void
  disabled?: boolean
  text: string
  loading?: boolean
}
const ButtonSubmit: React.FC<IButtonSubmit> = ({
  onClick,
  value,
  type,
  disabled = false,
  text,
  loading
}) => {
  return (
    <button
      type={type}
      className={`p-3 text-1xl text-center border font-semibold w-full rounded border-lime-500 shadow 
                      bg-lime-500 min-w-full ${
                        loading
                          ? 'cursor-not-allowed opacity-85'
                          : 'hover:bg-lime-400'
                      }`}
    >
      <div> {loading ? <Loading /> : text}</div>
    </button>
  )
}

export default ButtonSubmit
