import { Controller } from 'react-hook-form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useHttpGet } from '@/hooks/api'
import Loading from './loading'

type DropdownProps = {
  name: string
  control: any
  title: string
  churchId: string
  errors: any
}

export function SelectCem({ control, name, title, churchId, errors }: DropdownProps) {
  const { data, isLoading } = useHttpGet(`/api/protected/churches/${churchId}/cems`)

  return (
    <div className="flex flex-col w-full my-2">
      <Controller
        name={name}
        control={control}
        rules={{ required: 'Selecione uma Rede' }}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value}
          >
            <SelectTrigger className="w-full bg-gray-200 dark:bg-zinc-700 dark:text-gray-100">
              <SelectValue placeholder={title} />
            </SelectTrigger>
            <SelectContent>
              {isLoading && <Loading />}
              {!isLoading &&
                data?.data?.map((item: any) => (
                  <SelectItem key={item._id} value={`${item._id}-${item.name}`}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && <p className="mt-2 text-sm text-red-500">{errors[name]?.message}</p>}
    </div>
  )
}
