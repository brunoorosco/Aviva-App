import { useEffect, useState } from 'react'
// import Skeleton from '../Skeleton'
import { Controller } from 'react-hook-form'
import { useHttpGet } from '@/hooks/api'

interface DropdownProps extends React.HTMLProps<HTMLSelectElement> {
  title: string
  name: string
  errors: any
  control: any
}
type TChurch = {
  id: string
  name: string
}

export function SelectChurch({ control, name, errors, title }: DropdownProps) {
  const [items, setItems] = useState<TChurch[]>()
  const {
    data: church,
    error: errorRequest,
    isLoading
  } = useHttpGet<TChurch[]>(`/api/protected/churches`)

  useEffect(() => {
    if (church) {
      setItems(church.data)
    }
  }, [church])

  return (
    <div className='flex flex-col w-full my-2'>
      {/* {isLoading ? (
        <Skeleton />
      ) : (
        <> */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            defaultValue={title}
            {...field}
            className='w-full p-4 bg-gray-200 rounded-t dark:bg-zinc-700 dark:text-gray-300 open:w-11'
          >
            <option disabled>{title}</option>
            {church?.data.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        )}
      />
      {errors[name] && (
        <p className='block mt-2 text-sm text-red-400'>
          {errors[name].message}
        </p>
      )}
      {/* </>
      )} */}
    </div>
  )
}
