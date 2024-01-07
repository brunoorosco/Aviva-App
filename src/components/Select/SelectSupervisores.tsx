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
    <div className='flex flex-col w-full'>
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
            {supervisores?.map((item: any) => (
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
    </div>
  )
}
