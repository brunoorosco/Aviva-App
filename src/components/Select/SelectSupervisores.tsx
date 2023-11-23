import { useEffect, useState } from 'react'
// import Skeleton from '../Skeleton'
import { Controller } from 'react-hook-form'
import { useHttpGet } from '@/hooks/api'
import { useSession } from 'next-auth/react'

type DropdownProps = {
  title: string
  name: string
  errors: any
  control: any
}
type TSupervisores = {
  id: string
  name: string
}

export function SelectSupervisor({
  control,
  name,
  errors,
  title
}: DropdownProps) {
  const [items, setItems] = useState<TSupervisores[]>()
  const { data: session } = useSession()

  const {
    data: supervisores,
    error: errorRequest,
    isLoading
  } = useHttpGet<TSupervisores[]>(
    `/api/protected/churches/${session?.user.churchId}/supervisories`
  )

  useEffect(() => {
    if (supervisores) {
      setItems(supervisores)
    }
  }, [supervisores])
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
            {supervisores?.map((item: any) => (
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
