'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import ButtonSubmit from '@/components/ButtonSubmit'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ImportButton, { LeaderPair } from './ImportButton'
import { useHttpPost } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import Toast from '@/components/Toast'

type FormValues = {
  casas: LeaderPair[]
  data: string
}

const NovaCasaDePaz = () => {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      casas: [],
      data: new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
    }
  })

  const inputFileRef = useRef<HTMLInputElement>(null)
  const { fields, append, remove } = useFieldArray({ control, name: 'casas' })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const onSubmit = handleSubmit(async (data) => {
    console.log('Salvando:', data)
    setIsLoading(true)
    setIsLoading(true)
    const response = await useHttpPost({
      url: `/api/protected/churches/${session?.user.churchId}/casasdepaz`,
      data
    })
    setIsLoading(false)
    if (response?.error) Toast.showError('Erro ao salvar batismo!')
    else {
      Toast.showSuccess('CAsas de Paz cadastrada com sucesso!')
      router.back()
    }
    setIsLoading(false)
    router.back()
  })

  const handleImport = (imported: LeaderPair[]) => {
    fields.forEach((_, index) => remove(index))
    imported.forEach((casa) => append(casa))
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl'>Casa de Paz</h1>
        <div className='flex gap-2'>
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
          <ImportButton inputFileRef={inputFileRef} onImport={handleImport} />
        </div>
      </div>

      <form onSubmit={onSubmit} className='flex flex-col gap-4'>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className='border p-4 rounded-lg bg-gray-50 flex flex-col gap-4'
          >
            {/* Linha 1: Líder 1, Líder 2, Rede */}
            <div className='flex gap-4'>
              <div className='flex-1'>
                <Controller
                  name={`casas.${index}.lider1`}
                  control={control}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Líder 1</Label>
                      <Input {...field} placeholder='Líder 1' />
                    </div>
                  )}
                />
              </div>

              <div className='flex-1'>
                <Controller
                  name={`casas.${index}.lider2`}
                  control={control}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Líder 2</Label>
                      <Input {...field} placeholder='Líder 2' />
                    </div>
                  )}
                />
              </div>

              <div className='flex-1'>
                <Controller
                  name={`casas.${index}.rede`}
                  control={control}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Rede</Label>
                      <Input {...field} placeholder='Rede' />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Linha 2: Endereço, Anfitriã, Telefone */}
            <div className='flex gap-4'>
              <div className='flex-1'>
                <Controller
                  name={`casas.${index}.endereco`}
                  control={control}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Endereço</Label>
                      <Input {...field} placeholder='Endereço' />
                    </div>
                  )}
                />
              </div>

              <div className='flex-1'>
                <Controller
                  name={`casas.${index}.anfitria`}
                  control={control}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Anfitriã</Label>
                      <Input {...field} placeholder='Anfitriã' />
                    </div>
                  )}
                />
              </div>

              <div className='flex-1'>
                <Controller
                  name={`casas.${index}.telefone`}
                  control={control}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Telefone</Label>
                      <Input {...field} placeholder='Telefone' />
                    </div>
                  )}
                />
              </div>

              <button
                type='button'
                className='px-2 py-1 bg-red-500 text-white rounded'
                onClick={() => remove(index)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}

        <button
          type='button'
          className='px-3 py-2 bg-blue-500 text-white rounded'
          onClick={() =>
            append({
              lider1: '',
              lider2: '',
              endereco: '',
              rede: '',
              anfitria: '',
              telefone: ''
            })
          }
        >
          + Adicionar Casa
        </button>

        <ButtonSubmit
          text={isLoading ? 'Salvando...' : 'Salvar'}
          type='submit'
        />
      </form>
    </div>
  )
}

export default NovaCasaDePaz
