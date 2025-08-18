'use client'

import { useRouter } from 'next/router'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useState, useRef } from 'react'
import ButtonSubmit from '@/components/ButtonSubmit'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ExportButton from '@/components/ExportButton'
import ImportButton from './ImportButton'
import { SupervisorSelect } from '@/components/Select/SelectSupervisores'
import { CasaDePaz } from '@/domain/models/casaDePaz'

type FormValues = {
  casas: CasaDePaz[]
}

const NovaCasaDePaz = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      casas: [{ lider1: '', lider2: '', endereco: '', rede: '' }]
    }
  })

  const inputFileRef = useRef<HTMLInputElement>(null)
  const { fields, append, remove } = useFieldArray({ control, name: 'casas' })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data)
      setIsLoading(true)
      setIsLoading(false)
      router.back()
    } catch (err) {
      setIsLoading(false)
      console.error(err)
    }
  })

  const watchCasas = watch('casas')

  const mapCasaToExport = (item: CasaDePaz) => ({
    lider1: item.lider1,
    lider2: item.lider2,
    endereco: item.endereco,
    rede: item.rede,
    anfitria: item.anfitria,
    telefone: item.telefone
  })

  return (
    <div className='flex flex-col items-center p-4 md:p-6 lg:p-8'>
      {/* Cabeçalho */}
      <div className='w-full flex max-w-5xl justify-between items-center'>
        <h1 className='text-2xl md:text-3xl text-gray-600'>Nova Casa de Paz</h1>
        <div className='flex gap-2 h-10'>
          <ExportButton
            items={watchCasas}
            mapExport={mapCasaToExport}
            sheetName='casa_de_paz'
            filename='casa_de_paz.xlsx'
          />
          <ImportButton
            inputFileRef={inputFileRef}
            onImport={(imported: CasaDePaz[]) => {
              fields.forEach((_, index) => remove(index))
              imported.forEach((casa) => append(casa))
            }}
          />
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className='w-full max-w-5xl mt-6 flex flex-col gap-6'
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className='flex flex-col gap-2 border p-4 rounded-lg bg-gray-50'
          >
            {/* Linha 1: Líder 1 e Líder 2 */}
            <div className='flex gap-4'>
              <div className='w-2/5'>
                <Controller
                  control={control}
                  name={`casas.${index}.lider1`}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Líder 1</Label>
                      <Input
                        {...field}
                        placeholder='Líder 1'
                        className='uppercase'
                      />
                      {errors.casas?.[index]?.lider1 && (
                        <p className='text-sm text-red-400'>Obrigatório</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className='w-2/5'>
                <Controller
                  control={control}
                  name={`casas.${index}.lider2`}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Líder 2</Label>
                      <Input
                        {...field}
                        placeholder='Líder 2'
                        className='uppercase'
                      />
                      {errors.casas?.[index]?.lider2 && (
                        <p className='text-sm text-red-400'>Obrigatório</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className='w-1/5'>
                <div className='flex flex-col'>
                  <Label>Rede</Label>
                  <SupervisorSelect
                    key={index}
                    control={control}
                    name={`casas.${index}.supervisorId`}
                    title='CEM Responsável'
                  />
                  {errors.casas?.[index]?.rede && (
                    <p className='text-sm text-red-400'>Obrigatório</p>
                  )}
                </div>
              </div>
            </div>

            {/* Linha 2: Endereço, Rede, Botão Remover */}
            <div className='flex gap-4 items-end'>
              <div className='flex-1'>
                <Controller
                  control={control}
                  name={`casas.${index}.endereco`}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Anfitriã</Label>
                      <Input
                        {...field}
                        placeholder='Anfitriã'
                        className='uppercase'
                      />
                      {errors.casas?.[index]?.anfitria && (
                        <p className='text-sm text-red-400'>Obrigatório</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className='flex-1'>
                <Controller
                  control={control}
                  name={`casas.${index}.endereco`}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Endereço</Label>
                      <Input
                        {...field}
                        placeholder='Endereço'
                        className='uppercase'
                      />
                      {errors.casas?.[index]?.endereco && (
                        <p className='text-sm text-red-400'>Obrigatório</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className='w-1/5'>
                <Controller
                  control={control}
                  name={`casas.${index}.telefone`}
                  render={({ field }) => (
                    <div className='flex flex-col'>
                      <Label>Telefone</Label>
                      <Input
                        {...field}
                        placeholder='Telefone'
                        className='uppercase'
                      />
                      {errors.casas?.[index]?.endereco && (
                        <p className='text-sm text-red-400'>Obrigatório</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <button
                type='button'
                className='px-3 py-2 text-sm bg-red-500 text-white rounded-lg'
                onClick={() => remove(index)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}

        {/* Adicionar nova casa */}
        <button
          type='button'
          className='px-4 py-2 text-sm bg-blue-500 text-white rounded-lg self-start'
          onClick={() =>
            append({ lider1: '', lider2: '', endereco: '', rede: '' })
          }
        >
          + Adicionar Casa
        </button>

        {/* Submit */}
        <div className='w-full mt-4'>
          <ButtonSubmit
            text={isLoading ? 'Salvando...' : 'Salvar'}
            type='submit'
          />
        </div>
      </form>
    </div>
  )
}

export default NovaCasaDePaz
