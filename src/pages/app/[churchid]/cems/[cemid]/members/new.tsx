'use client'

import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { useHttpPost } from '@/hooks/api'
import Toast from '@/components/Toast'
import { Masks } from '@/utils/masks'
import { SelectSupervisorCem } from '@/components/Select/SelectSupervisoresCem'
import { SelectProfile } from '@/components/Select/SelectProfile'
import { roles } from '@/utils/constants/roles'
import ButtonSubmit from '@/components/ButtonSubmit'

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
  const { control, handleSubmit } = useForm<FormValues>()
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/cems/${session?.user.cem._id}/members`,
        data
      })
      setIsLoading(false)

      if (response?.error) {
        Toast.showError('Erro ao Salvar!')
        return
      }

      Toast.showSuccess('Salvo com Sucesso!')
      router.back()
    } catch (error) {
      setIsLoading(false)
      console.error('[ERROR]:', error)
      Toast.showError('Erro ao salvar')
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
        {/* Nome */}
        <Controller
          name='name'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder='Nome Completo'
              className='uppercase w-full'
              onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
            />
          )}
        />

        {/* Email */}
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder='Email' className='w-full' />
          )}
        />

        {/* Phone e Birth */}
        <div className='flex flex-col md:flex-row gap-4'>
          <Controller
            name='phone'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='WhatsApp'
                className='w-full'
                onChange={(e) => field.onChange(Masks.phone(e.target.value))}
              />
            )}
          />
          <Controller
            name='birth'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input {...field} type='date' className='w-full' placeholder='Data de Nascimento' />
            )}
          />
        </div>

        {/* Logradouro e Número */}
        <div className='flex flex-col md:flex-row gap-4'>
          <Controller
            name='street'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Logradouro'
                className='uppercase w-full md:w-2/3'
                onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
              />
            )}
          />
          <Controller
            name='number'
            control={control}
            render={({ field }) => <Input {...field} placeholder='Nº' className='uppercase w-full md:w-1/3' />}
          />
        </div>

        {/* Cidade e CEP */}
        <div className='flex flex-col md:flex-row gap-4'>
          <Controller
            name='city'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Cidade'
                className='uppercase w-full md:w-2/3'
                onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
              />
            )}
          />
          <Controller
            name='zipcode'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='CEP'
                className='w-full md:w-1/3'
                onChange={(e) => field.onChange(Masks.cep(e.target.value))}
              />
            )}
          />
        </div>

        {/* Supervisor */}
        <SelectSupervisorCem name='cemId' control={control} errors={false} title='Supervisores' />

        {/* Perfil */}
        <SelectProfile name='profileId' control={control} errors={false} options={roles} title='Cargo Eclesiástico' />

        {/* Botão */}
        <ButtonSubmit text='Salvar' type='submit' disabled={isLoading} />
      </form>
    </div>
  )
}

export default NewMember
