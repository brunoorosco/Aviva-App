import { useEffect, useState } from 'react'
import Skeleton from '../Skeleton'
import { Controller } from 'react-hook-form'
import { useHttpGet } from '@/hooks/api'

type DropdownProps = {
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
      setItems(church)
    }
  }, [church])
  return (
    <div className='w-full flex flex-col my-2'>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <select
                defaultValue={title}
                {...field}
                className='bg-gray-200  p-4 rounded-t w-full dark:bg-zinc-700 dark:text-gray-300 open:w-11'
              >
                <option disabled>{title}</option>
                {church?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors[name] && (
            <p className='text-red-400 text-sm block mt-2'>
              {errors[name].message}
            </p>
          )}
        </>
      )}
    </div>
  )
}
