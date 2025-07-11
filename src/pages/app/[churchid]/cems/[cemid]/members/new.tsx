import TextInput from '@/components/Input'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import ButtonSubmit from '@/components/ButtonSubmit'
import { useHttpPost } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import Toast from '@/components/Toast'
import { Masks } from '@/utils/masks'
import { SelectSupervisorCem } from '@/components/Select/SelectSupervisoresCem'
import { SelectProfile } from '@/components/Select/SelectProfile'
import { roles } from '@/utils/constants/roles'

type FormValues = {
  name: string
  email?: string
  phone: string
  zipcode: string
  street: string
  number: string
  city: string
  cemId: string
  birth: string
  profileId: number
}

const NewMember = () => {
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
        url: `/api/protected/churches/${session?.user.churchId}/cems/${session?.user.cemId}/members`,
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
      <div className='w-full max-w-2xl text-center'>
        <h1 className='text-2xl md:text-3xl text-gray-600 dark:text-dark-primary'>
          Cadastro de Membros
        </h1>
      </div>

      <form onSubmit={onSubmit} className='w-full max-w-2xl mt-6 flex flex-col gap-4'>
        <TextInput
          {...register('name', { required: true })}
          name='name'
          className='uppercase'
          placeholder='Nome Completo'
          control={control}
          mask={(e: string) => Masks.inputName(e)}
          error={errors.name ? 'Preenchimento Obrigatório' : ''}
        />

        <TextInput
          {...register('email')}
          name='email'
          className='uppercase'
          placeholder='Email'
          control={control}
        />

        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full md:w-1/2'>
            <TextInput
              {...register('phone', { required: true })}
              name='phone'
              placeholder='WhatsApp'
              mask={(e: string) => Masks.phone(e)}
              className='uppercase'
              control={control}
              error={errors.phone ? 'Preenchimento Obrigatório' : ''}
            />
          </div>
          <div className='w-full md:w-1/2'>
            <TextInput
              {...register('birth')}
              name='birth'
              type='date'
              placeholder='Data de Nascimento'
              className='uppercase'
              control={control}
              error={errors.birth ? 'Preenchimento Obrigatório' : ''}
            />
          </div>
        </div>

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
              maxLength={9}
              control={control}
              mask={(e: string) => Masks.cep(e)}
            />
          </div>
        </div>

        <SelectSupervisorCem
          errors={false}
          title={'Supervisores'}
          name='cemId'
          control={control}
        />

        <SelectProfile
           options={roles}
          errors={false}
          title={'Cargo Eclesiástico'}
          name='profileId'
          control={control}
        />

        <ButtonSubmit text='Salvar' type='submit' />
      </form>
    </div>
  )
}

export default NewMember
