import React from 'react'

const TextInput = ({
  maxLength,
  placeholder,
  onChange,
  value,
  type,
  disabled = false,
  onBlur
}) => {
  return (
    <div className="flex justify-center">
      <input
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
