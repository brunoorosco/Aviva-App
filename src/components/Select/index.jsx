const Select = ({ options, value, onChange, title }) => {
  return (
    <div className="flex justify-center">
      <select
        value={value}
        onChange={(event) => onChange && onChange(event)}
        className="p-4 block shadow bg-gray-100 my-2 rounded w-full max-w-md m-2"
      >
        <option value="" disabled>
          {title}
        </option>
        {options.map((opt, index) => (
          <option key={opt.value + index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
