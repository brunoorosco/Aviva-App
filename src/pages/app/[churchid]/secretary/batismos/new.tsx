'use client'

import { useRouter } from 'next/router'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useState, useRef } from 'react'
import ButtonSubmit from '@/components/ButtonSubmit'
import { useHttpPost } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import Toast from '@/components/Toast'
import { Masks } from '@/utils/masks'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SupervisorSelect } from '@/components/Select/SelectSupervisores'
import ExportButton from '@/components/ExportButton'
import ImportButton from '../../../../../components/batismo/ImportButton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type Person = {
  name: string
  supervisorId: string
  sexo: '' | 'M' | 'F'
}

type FormValues = {
  date: string
  local: string
  people: Person[]
}

const NovoBatismo = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: { people: [{ name: '', supervisorId: '', sexo: '' }] }
  })
  const inputFileRef = useRef<HTMLInputElement>(null)

  const { fields, append, remove } = useFieldArray({ control, name: 'people' })
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/batismo`,
        data
      })
      setIsLoading(false)
      if (response?.error) Toast.showError('Erro ao salvar batismo!')
      else {
        Toast.showSuccess('Batismo cadastrado com sucesso!')
        router.back()
      }
    } catch (err) {
      setIsLoading(false)
      console.error('[BAPTISM_ERROR]:', err)
    }
  })

  const watchPeople = watch('people')

  return (
    <div className='flex flex-col items-center p-4 md:p-6 lg:p-8'>
      <div className='w-full flex max-w-5xl justify-between text-center'>
        <h1 className='text-2xl md:text-3xl text-gray-600 dark:text-dark-primary'>
          Novo Batismo
        </h1>
        <div className='flex gap-2 h-10'>
          <ExportButton
            items={watchPeople} // <-- aqui é a lista do formulário
            mapExport={(item) => ({
              nome: item.name,
              rede: item.supervisorId
            })}
            sheetName={'batismo'}
            filename={'batismo.xlsx'}
          />
          <ImportButton inputFileRef={inputFileRef} />
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className='w-full max-w-5xl mt-6 flex flex-col gap-6'
      >
        {/* Data e Local */}
        <div className='flex w-full gap-4'>
          <div className='w-1/2'>
            <Controller
              control={control}
              name='date'
              render={({ field }) => (
                <div className='flex flex-col'>
                  <Label>Data do Batismo</Label>
                  <Input {...field} type='date' />
                  {errors.date && (
                    <p className='text-sm text-red-400'>Obrigatório</p>
                  )}
                </div>
              )}
            />
          </div>
          <div className='w-1/2'>
            <Controller
              control={control}
              name='local'
              render={({ field }) => (
                <div className='flex flex-col'>
                  <Label>Local do Batismo</Label>
                  <Input
                    {...field}
                    className='uppercase'
                    onChange={(e) =>
                      field.onChange(Masks.inputName(e.target.value))
                    }
                  />
                  {errors.local && (
                    <p className='text-sm text-red-400'>Obrigatório</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Batizandos */}
        <div className='w-full flex flex-col gap-2'>
          <Label>Batizandos</Label>
          <button
            type='button'
            className='px-4 py-2 text-sm bg-blue-500 text-white rounded-lg mt-2 self-start'
            onClick={() => append({ name: '', supervisorId: '', sexo: 'F' })}
          >
            + Adicionar Pessoa
          </button>
          {fields.map((field, index) => (
            <div key={field.id} className='flex w-full gap-2 items-center'>
              {/* Nome do batizando */}
              <div className='w-3/4'>
                <Controller
                  control={control}
                  name={`people.${index}.name`}
                  render={({ field }) => (
                    <div className='flex flex-col w-full'>
                      <Input
                        {...field}
                        placeholder={`Nome do batizando ${index + 1}`}
                        className='uppercase'
                        onChange={(e) =>
                          field.onChange(Masks.inputName(e.target.value))
                        }
                      />
                      {errors.people?.[index]?.name && (
                        <p className='text-sm text-red-400'>Obrigatório</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Supervisor */}
              <div className='w-1/4'>
                <Controller
                  control={control}
                  name={`people.${index}.sexo`}
                  defaultValue='' // garante valor inicial vazio
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Sexo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key='M' value='M'>
                          Masculino
                        </SelectItem>
                        <SelectItem key='F' value='F'>
                          Feminino
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className='w-1/4'>
                <SupervisorSelect
                  key={index}
                  control={control}
                  name={`people.${index}.supervisorId`}
                  title='CEM Responsável'
                />
                {errors.people?.[index]?.supervisorId && (
                  <p className='text-sm text-red-400'>Obrigatório</p>
                )}
              </div>
              {/* Remover */}
              <button
                type='button'
                className='px-3 py-2 text-sm bg-red-500 text-white rounded-lg'
                onClick={() => remove(index)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        {/* Botão de submit */}
        <div className='w-full'>
          <ButtonSubmit
            text={isLoading ? 'Salvando...' : 'Salvar'}
            type='submit'
          />
        </div>
      </form>
    </div>
  )
}

export default NovoBatismo
