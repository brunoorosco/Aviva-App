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
    <div className='flex flex-col items-center p-4 md:p-6 lg:p-8'>
      <div className='w-full max-w-5xl text-center'>
        <h1 className='text-2xl md:text-3xl text-gray-600 dark:text-dark-primary'>
          Cadastro de Rede
        </h1>
      </div>

      <form onSubmit={onSubmit} className='w-full max-w-5xl mt-6 flex flex-col gap-4'>
        {/* Nome da Rede */}
        <TextInput
          {...register('name', { required: true })}
          name='name'
          placeholder='Nome da Rede'
          control={control}
          className='uppercase'
          mask={(e: string) => Masks.inputName(e)}
          error={errors.name ? 'Preenchimento Obrigatório' : ''}
        />

        {/* Logradouro e Número */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full md:w-2/3'>
            <TextInput
              name='street'
              placeholder='Logradouro'
              className='uppercase'
              mask={(e: string) => Masks.inputName(e)}
              control={control}
            />
          </div>
          <div className='w-full md:w-1/3'>
            <TextInput
              name='number'
              placeholder='Nº'
              control={control}
              className='uppercase'
            />
          </div>
        </div>

        {/* Cidade e CEP */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full md:w-2/3'>
            <TextInput
              name='city'
              placeholder='Cidade'
              control={control}
              className='uppercase'
              mask={(e: string) => Masks.inputName(e)}
            />
          </div>
          <div className='w-full md:w-1/3'>
            <TextInput
              placeholder='CEP'
              name='zipcode'
              control={control}
              mask={(e: string) => Masks.cep(e)}
            />
          </div>
        </div>

        {/* Supervisor */}
        <div className='w-full'>
          <SelectSupervisor
            errors={false}
            title={'Supervisores'}
            name='supervisor'
            control={control}
          />
        </div>

        {/* Botão */}
        <div className='w-full'>
          <ButtonSubmit text='Salvar' type='submit' />
        </div>
      </form>
    </div>
  )
}

export default NewRede
