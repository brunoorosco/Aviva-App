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
type TProfile = {
  id: string
  description: string
}

export function SelectProfile({ control, name, errors, title }: DropdownProps) {
  const [items, setItems] = useState<TProfile[]>()
  const { data: session } = useSession()
  // const {
  //   data: profile,
  //   error: errorRequest,
  //   isLoading
  // } = useHttpGet<TProfile[]>(`/api/protected/profile`)

  const profile = [{
    id: '99',
    description: 'Selecione um perfil'
  },
  {
    id: '1',
    description: 'Administrador'
  },
  {
    id: '2',
    description: 'Membro'
  }]
  useEffect(() => {
    if (profile) {
      const filterProfile = profile.filter(
        (p) => parseInt(p.id) >= (session?.user.profileId || 99)
      )
      setItems(filterProfile)
    }
  }, [profile])
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
            {items?.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.description}
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
