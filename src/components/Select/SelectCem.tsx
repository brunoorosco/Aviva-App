import { Suspense, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useHttpGet } from '@/hooks/api'

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
    <Suspense
      fallback={
        <div role='status' className='max-w-sm ml-4 animate-pulse'>
          <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4' />
          <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5' />
          <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5' />
          <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5' />
          <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5' />
          <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]' />
          <span className='sr-only'>Loading...</span>
        </div>
      }
    >
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
