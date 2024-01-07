import TextInput from '@/components/Input'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import ButtonSubmit from '@/components/ButtonSubmit'
import { useHttpPost } from '@/hooks/api'
import { SelectSupervisor } from '@/components/Select/SelectSupervisores'
import { useSession } from 'next-auth/react'
import Toast from '@/components/Toast'
import { Masks } from '@/utils/masks'

type FormValues = {
  name: string
  zipcode: string
  street: string
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
  const { data: session } = useSession()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setError('')
      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/cems`,
        data
      })

      setIsLoading(false)
      console.log(response)
      if (response) {
        Toast.showSuccess('Salvo com Sucesso!')
      }

      if (response?.error) {
        Toast.showError('Erro ao Salvar!')
        setError('')
        return
      }

      router.back()
    } catch (error) {
      setIsLoading(false)
      console.log('[LOGIN_ERROR]: ', error)
    }
  })
  return (
    <div className='flex flex-col items-center p-3 mt-5 md:mt-5'>
      <div className='content-center w-full max-w-lg text-center'>
        <div className='w-full px-3 mb-2 md:w-full md:mb-0'>
          <label className='text-2xl text-gray-600 md:text-3xl dark:text-dark-primary'>
            Cadastro de Rede
          </label>
        </div>
      </div>
      <form className='px-1 mt-5 text-black max-md:w-full' onSubmit={onSubmit}>
        <div className='flex'>
          <div className='w-full mt-2 mb-2 md:mb-0'>
            <TextInput
              {...register('name', { required: true })}
              name='name'
              placeholder='Nome da Rede'
              control={control}
              className='uppercase'
              mask={(e: string) => Masks.inputName(e)}
              error={errors.name ? 'Preenchimento Obrigatório' : ''}
            />
          </div>
        </div>
        <div className='flex w-full'>
          <div className='w-2/3 mb-3 md:w-2/3 md:mb-0'>
            <TextInput
              name='street'
              placeholder='Logradouro'
              className='uppercase'
              mask={(e: string) => Masks.inputName(e)}
              control={control}
            />
          </div>
          <div className='w-1/3 ml-3 md:w-1/3'>
            <TextInput
              name='number'
              placeholder='Nº'
              control={control}
              className='uppercase'
            />
          </div>
        </div>
        <div className='md:flex'>
          <div className='w-full mb-3 md:w-2/3 md:mb-0'>
            <TextInput
              name='city'
              placeholder='Cidade'
              control={control}
              className='uppercase'
              mask={(e: string) => Masks.inputName(e)}
            />
          </div>

          <div className='w-full mb-3 md:w-1/3 md:mb-0 md:ml-3'>
            <TextInput
              placeholder='CEP'
              name='zipcode'
              control={control}
              mask={(e: string) => Masks.cep(e)}
            />
          </div>
        </div>
        <div className='md:flex'>
          <div className='w-full mb-3 '>
            <SelectSupervisor
              errors={false}
              title={'Supervisores'}
              name='supervisor'
              control={control}
            />
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

export default NewRede
