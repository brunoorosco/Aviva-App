import TextInput from '@/components/Input'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loading } from '@/components/Loading'
import { useState } from 'react'
import axios from 'axios'
import ButtonSubmit from '@/components/ButtonSubmit'
import { useHttpPost } from '@/hooks/api'

type FormValues = {
  church: string
  zipcode: string
  address: string
  number: string
  city: string
}

const Admin = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()
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
        setError('')
        return
      }

      //   router.replace('/app')
    } catch (error) {
      setIsLoading(false)
      console.log('[LOGIN_ERROR]: ', error)
    }
  })
  return (
    <div className='flex flex-col items-center p-3 mt-10 md:mt-5'>
      <div className='content-center w-full max-w-lg text-center'>
        <div className='w-full px-3 mb-2 md:w-full md:mb-0'>
          <label className='text-2xl text-gray-600 md:text-3xl dark:text-dark-primary'>
            Cadastro de Igrejas
          </label>
        </div>
      </div>
      <form className='px-1 mt-5 max-md:w-full' onSubmit={onSubmit}>
        <div className='flex'>
          <div className='w-full mb-2 md:mb-0'>
            <TextInput
              {...register('church', { required: true })}
              name='church'
              placeholder='Nome da igreja'
              control={control}
              error={errors.church ? 'Preenchimento Obrigatório' : ''}
            />
          </div>
        </div>
        <div className='flex w-full'>
          <div className='w-2/3 mb-3 md:w-2/3 md:mb-0'>
            <TextInput
              name='address'
              placeholder='Logradouro'
              control={control}
            />
          </div>
          <div className='w-1/3 ml-3 md:w-1/3'>
            <TextInput name='number' placeholder='Nº' control={control} />
          </div>
        </div>
        <div className='md:flex'>
          <div className='w-full mb-3 md:w-2/3 md:mb-0'>
            <TextInput name='city' placeholder='Cidade' control={control} />
          </div>

          <div className='w-full mb-3 md:w-1/3 md:mb-0 md:ml-3'>
            <TextInput placeholder='CEP' name='zipcode' control={control} />
          </div>
        </div>
        <div className='flex'>
          <div className='w-full mb-6 md:w-full md:mb-0'>
            <ButtonSubmit text='Salvar' type='submit' />
          </div>
        </div>
      </form>
    </div>
  )
}

export default Admin
