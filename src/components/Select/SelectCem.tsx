import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useHttpGet } from '@/hooks/api'
// import Skeleton from '@/components/Skeleton'

type DropdownProps = {
  title: string
  name: string
  errors: any
  control: any
  churchId: string
}
type TCem = {
  id: string
  name: string
}

export function SelectCem({
  control,
  name,
  errors,
  title,
  churchId
}: DropdownProps) {
  const [items, setItems] = useState<TCem[]>()

  const {
    data: cem,
    error: errorRequest,
    isLoading
  } = useHttpGet<TCem[]>(`/api/protected/churches/${churchId}`)

  useEffect(() => {
    if (cem) {
      setItems(cem)
    }
  }, [cem])
  return (
    <div className='w-full flex flex-col my-2'>
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
            className='bg-gray-200  p-4 rounded-t w-full dark:bg-zinc-700 dark:text-gray-300 open:w-11'
          >
            <option disabled>{title}</option>
            {cem?.map((item: any) => (
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
      {/* </>
      )} */}
    </div>
  )
}
