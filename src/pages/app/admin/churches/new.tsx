'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import ButtonSubmit from '@/components/ButtonSubmit'
import { useHttpPost } from '@/hooks/api'
import { Masks } from '@/utils/masks'

type FormValues = {
  church: string
  zipcode: string
  address: string
  number: string
  city: string
}

const Admin = () => {
  const { control, handleSubmit } = useForm<FormValues>()
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setError('')
      const response = await useHttpPost({
        url: '/api/protected/churches',
        data
      })
      setIsLoading(false)

      if (response?.error) {
        setError('Erro ao salvar igreja!')
        return
      }

      // router.replace('/app') // descomente se quiser redirecionar
    } catch (err) {
      setIsLoading(false)
      console.error('[SUBMIT_ERROR]:', err)
      setError('Erro durante o cadastro')
    }
  })

  return (
    <div className='flex flex-col items-center p-3 mt-10 md:mt-5'>
      <div className='content-center w-full max-w-lg text-center'>
        <h1 className='text-2xl text-gray-600 md:text-3xl dark:text-dark-primary'>
          Cadastro de Igrejas
        </h1>
      </div>

      <form
        className='px-1 mt-5 max-md:w-full flex flex-col gap-4'
        onSubmit={onSubmit}
      >
        {/* Nome da Igreja */}
        <Controller
          name='church'
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder='Nome da Igreja'
              className='w-full'
            />
          )}
        />

        {/* Endereço e Número */}
        <div className='flex flex-col md:flex-row gap-4'>
          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder='Logradouro' className='w-full' />
            )}
          />
          <Controller
            name='number'
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder='Nº' className='w-full' />
            )}
          />
        </div>

        {/* Cidade e CEP */}
        <div className='flex flex-col md:flex-row gap-4'>
          <Controller
            name='city'
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder='Cidade' className='w-full' />
            )}
          />
          <Controller
            name='zipcode'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='CEP'
                className='w-full'
                onChange={(e) => field.onChange(Masks.cep(e.target.value))}
              />
            )}
          />
        </div>

        {/* Botão */}
        <ButtonSubmit text='Salvar' type='submit' disabled={isLoading} />

        {error && <p className='text-red-500 mt-2'>{error}</p>}
      </form>
    </div>
  )
}

export default Admin
