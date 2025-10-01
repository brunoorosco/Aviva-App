'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import ButtonSubmit from '@/components/ButtonSubmit'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ImportButton from '../../../../../components/sejaLivre/ImportButton'
import { useHttpPost } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import Toast from '@/components/Toast'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'

type TEncontrista = {
  name: string
  rede: string
  telefone?: string
  email?: string
  endereco?: string
  idade?: number
}
type FormValues = {
  encontristas: TEncontrista[]
  data: string
  igreja: string
  numero?: number
}

const NovoEncontroComDeus = () => {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      encontristas: [],
      data: new Date().toISOString().split('T')[0],
      igreja: ''
    }
  })

  const inputFileRef = useRef<HTMLInputElement>(null)
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'encontristas'
  })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const encontristas = watch('encontristas')

  const onSubmit = handleSubmit(async (data) => {
    if (!data.encontristas || data.encontristas.length === 0) {
      Toast.showError('Adicione pelo menos uma Casa de Paz antes de salvar!')
      return
    }

    setIsLoading(true)
    const response = await useHttpPost({
      url: `/api/protected/churches/${session?.user.churchId}/sejaLivre`,
      data
    })
    setIsLoading(false)

    if (response?.error) {
      Toast.showError('Erro ao salvar Encontro com Deus!')
    } else {
      Toast.showSuccess('Encontro com Deus cadastrado com sucesso!')
      router.back()
    }
  })

  const handleImport = (imported: TEncontrista[]) => {
    fields.forEach((_, index) => remove(index))
    imported.forEach((casa) => append(casa))
  }

  return (
    <div className='p-4'>
      {/* HEADER */}
      <div className='flex flex-col gap-4 mb-4 md:flex-row md:items-end md:justify-between'>
        <h1 className='text-2xl'>Encontro Seja Livre</h1>

        <div className='grid grid-cols-6 gap-4'>
          <div className='col-span-3'>
            <Controller
              name='data'
              control={control}
              render={({ field }) => (
                <div className='flex flex-col'>
                  <Label>Data</Label>
                  <Input {...field} type='date' />
                </div>
              )}
            />
          </div>
          <div className='col-span-2'>
            <Controller
              name='numero'
              control={control}
              render={({ field }) => (
                <div className='flex flex-col'>
                  <Label>Número</Label>
                  <Input {...field} type='number' />
                </div>
              )}
            />
          </div>
          <div className='col-span-1 mt-3 ml-auto'>
            <ImportButton inputFileRef={inputFileRef} onImport={handleImport} />
          </div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={onSubmit} className='flex flex-col gap-4'>
        {/* BOTÕES */}
        <div className='flex flex-col gap-2 md:flex-row md:justify-end'>
          <Button
            type='button'
            className='bg-blue-500 text-white rounded'
            onClick={() =>
              append({
                name: '',
                telefone: '',
                email: '',
                rede: '',
                endereco: ''
              })
            }
          >
            + Adicionar Encontrista
          </Button>

          <Button
            className='bg-[#04AA6D] text-white hover:bg-[#04AA6Daa] hover:text-white'
            type='submit'
            disabled={isLoading || !encontristas || encontristas.length === 0}
          >
            {isLoading ? <Loader2Icon className='animate-spin' /> : 'Salvar'}
          </Button>
        </div>

        {/* LISTA DE ENCONTRISTAS */}
        {fields
          .slice() // evita mutação com reverse direto
          .reverse()
          .map((field, index) => (
            <div
              key={field.id}
              className='border border-gray-400 p-4 rounded-lg bg-gray-50 flex flex-col gap-4'
            >
              <div className='flex flex-col gap-4 md:flex-row'>
                <div className='w-full md:w-3/12'>
                  <Controller
                    name={`encontristas.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder='Nome do Encontrista' />
                    )}
                  />
                </div>

                <div className='w-full md:w-1/12'>
                  <Controller
                    name={`encontristas.${index}.idade`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder='Idade' />
                    )}
                  />
                </div>

                <div className='w-full md:w-1/12'>
                  <Controller
                    name={`encontristas.${index}.rede`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder='Rede' />
                    )}
                  />
                </div>

                <div className='w-full md:w-1/12'>
                  <Controller
                    name={`encontristas.${index}.telefone`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder='Telefone' />
                    )}
                  />
                </div>

                <div className='w-full md:flex-1'>
                  <Controller
                    name={`encontristas.${index}.endereco`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder='Endereço' />
                    )}
                  />
                </div>

                <button
                  type='button'
                  className='px-2 py-1 bg-red-500 text-white rounded w-full md:w-auto'
                  onClick={() => remove(index)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
      </form>
    </div>
  )
}

export default NovoEncontroComDeus
