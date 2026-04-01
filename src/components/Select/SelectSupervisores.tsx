import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useHttpGet } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

type DropdownProps = {
  title: string
  name: string
  control: any
  errors?: any
}

type TSupervisor = {
  _id: string
  name: string
}

// SupervisorSelect
export const SupervisorSelect = ({
  control,
  name,
  title
}: {
  control: any
  name: string
  title: string
}) => {
  const { data: session } = useSession()
  const [items, setItems] = useState<TSupervisor[]>([])

  const { data: supervisores } = useHttpGet<TSupervisor[]>(
    `/api/protected/churches/${session?.user.churchId}/redes`
  )

  useEffect(() => {
    if (supervisores?.data) {
      if (Array.isArray(supervisores.data)) {
        setItems(supervisores.data)
      } else if ((supervisores.data as any).data && Array.isArray((supervisores.data as any).data)) {
        setItems((supervisores.data as any).data)
      }
    } 
  }, [supervisores])

  return (
    <Controller
      control={control}
      name={name}
      defaultValue="" // garante valor inicial vazio
      render={({ field }) => (
        <Select value={field.value || ''} onValueChange={field.onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={title} />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(items) && items.map((item) => (
              <SelectItem key={item._id} value={`${item._id}|${item.name}`}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}
