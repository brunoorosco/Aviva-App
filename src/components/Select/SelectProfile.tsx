import { Controller } from 'react-hook-form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type DropdownProps = {
  title: string
  name: string
  errors: any
  control: any
  options: string[] // lista de cargos (roles)
}

export function SelectProfile({
  control,
  name,
  errors,
  title,
  options
}: DropdownProps) {
  return (
    <div className='flex flex-col w-full my-2'>
      <Controller
        name={name}
        control={control}
        rules={{
          required: 'Selecione um cargo válido'
        }}
        render={({ field }) => (
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <SelectTrigger className='w-full bg-gray-200 dark:bg-zinc-700 dark:text-gray-100'>
              <SelectValue placeholder={title} />
            </SelectTrigger>
            <SelectContent>
              {options.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && (
        <p className='mt-2 text-sm text-red-500'>{errors[name]?.message}</p>
      )}
    </div>
  )
}
