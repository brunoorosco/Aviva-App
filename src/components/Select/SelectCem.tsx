import { Suspense, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useHttpGet } from '@/hooks/api'
import Skeleton from '../Skeleton'

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
  } = useHttpGet<TCem[]>(`/api/protected/churches/${churchId}/cems`)

  useEffect(() => {
    if (cem) {
      setItems(cem)
    }
  }, [cem])
  return (
    <Suspense fallback={<Skeleton />}>
      <div className='flex flex-col w-full my-2'>
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
              {!isLoading &&
                cem?.map((item: any) => (
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
    </Suspense>
  )
}
