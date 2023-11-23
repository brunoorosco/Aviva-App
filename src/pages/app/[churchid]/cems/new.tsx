import TextInput from '@/components/Input'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import ButtonSubmit from '@/components/ButtonSubmit'
import { useHttpPost } from '@/hooks/api'
import { SelectSupervisor } from '@/components/Select/SelectSupervisores'

type FormValues = {
  rede: string
  zipcode: string
  address: string
  number: string
  city: string
  pastor_id: string
  supervisor_id: string
}

const NewRede = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()
  const router = useRouter()
  const { pathname } = router

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setError('')
      const response = await useHttpPost({
        url: '/api/protected',
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
    <div className='flex flex-col items-center mt-10 md:mt-5 p-3'>
      <div className='text-center w-full max-w-lg content-center'>
        <div className='w-full md:w-full px-3 mb-2 md:mb-0'>
          <label className='text-2xl md:text-3xl text-gray-600 dark:text-dark-primary'>
            Cadastro de Rede
          </label>
        </div>
      </div>
      <form className='max-md:w-full mt-5 px-1 text-black' onSubmit={onSubmit}>
        <div className='flex'>
          <div className='w-full mb-2 md:mb-0 '>
            <TextInput
              {...register('rede', { required: true })}
              name='rede'
              className='placeholder:text-gray-600'
              placeholder='Nome da Rede'
              control={control}
              error={errors.rede ? 'Preenchimento Obrigatório' : ''}
            />
          </div>
        </div>
        <div className='flex w-full'>
          <div className='w-2/3 md:w-2/3 mb-3 md:mb-0'>
            <TextInput
              name='address'
              placeholder='Logradouro'
              control={control}
            />
          </div>
          <div className='w-1/3 md:w-1/3 ml-3'>
            <TextInput name='number' placeholder='Nº' control={control} />
          </div>
        </div>
        <div className='md:flex'>
          <div className='md:w-2/3 w-full mb-3 md:mb-0'>
            <TextInput name='city' placeholder='Cidade' control={control} />
          </div>

          <div className='md:w-1/3 w-full mb-3 md:mb-0 md:ml-3'>
            <TextInput placeholder='CEP' name='zipcode' control={control} />
          </div>
        </div>
        <div className='md:flex'>
          <div className='md:w-2/3 w-full mb-3 md:mb-0'>
            <SelectSupervisor
              errors={false}
              title={'Supervisores'}
              name='supervisor'
              control={control}
            />
          </div>
        </div>
        <div className='flex'>
          <div className='w-full md:w-full mb-6 md:mb-0'>
            <ButtonSubmit text='Salvar' type='submit' />
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewRede
