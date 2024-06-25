import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TextInput from '@/components/Input'
import { Masks } from '@/utils/masks'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { SelectSupervisor } from '@/components/Select/SelectSupervisores'
import ButtonSubmit from '@/components/ButtonSubmit'
import RadioInput from '@/components/RadioInput'
import { optionAccepted, optionBapstism } from '@/components/RadioInput/options'
import { SelectCem } from '@/components/Select/SelectCem'

type FormValues = {
  name: string
  email: string
  phone: string
  cem: string
  accepted: string
  bapstism: boolean
  acceptedAt: string
}
const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const AceitouJesus = () => {
  const { data: session } = useSession()
  const dataRetro = new Date()
  dataRetro.setDate(dataRetro.getDate())
  const dataRetroISO = dataRetro.toISOString().split('T')[0]
  const churchId = session?.user.churchId as string
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ defaultValues: { acceptedAt: dataRetroISO } })
  const { data, error } = useSWR(
    `/api/protected/churches/${churchId}/cems`,
    fetcher
  )

  const [erro, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // async function handleSubmit(evt: any) {
  //   evt.preventDefault()
  //   try {
  //     const response = await axios.post('/api/escola-profeta/new', form)
  //     if (response.status === 201) {
  //       Toast.showSuccess(
  //         `${response.data.name}, sua inscrição foi realizada com sucesso!!!`
  //       )
  //       setForm({ name: '', email: '', phone: '', tribe: '' })
  //     }
  //   } catch (error) {
  //     Toast.showError('Não foi possível completar sua inscrição')
  //   }
  // }
  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('[LOGIN_ERROR]: ', data)
      setIsLoading(true)
      setError('')

      setIsLoading(false)

      //   if (response?.error) {
      //     setError('Email ou senha inválidos')
      //     return
      //   }

      //   router.replace('/app')
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
            Aceitou Jesus
          </label>
        </div>
      </div>

      <form
        className='w-1/3 px-1 mt-5 text-black max-md:w-full'
        onSubmit={onSubmit}
        method='post'
      >
        <div className='mt-2 mb-2 md:mb-0'>
          <TextInput
            {...register('acceptedAt')}
            name='acceptedAt'
            type='date'
            defaultValue={dataRetroISO}
            className='text-lg text-center placeholder:text-gray-600'
            control={control}
          />
        </div>
        <div className='mt-2 mb-2 md:mb-0'>
          <TextInput
            {...register('name', { required: true })}
            name='name'
            className='placeholder:text-gray-600'
            placeholder='Nome Completo'
            control={control}
            error={errors.name ? 'Preenchimento Obrigatório do Nome' : ''}
            mask={(e: string) => Masks.inputName(e)}
          />
        </div>
        <div className='w-full mt-2 mb-2 md:mb-0'>
          <TextInput
            {...register('email')}
            name='email'
            placeholder='E-mail'
            control={control}
          />
        </div>
        <div className='w-full mt-2 mb-2 md:mb-0'>
          <TextInput
            {...register('phone')}
            name='phone'
            placeholder='WhatsApp'
            mask={(e: string) => Masks.phone(e)}
            control={control}
          />
        </div>
        <div className='w-full mb-5 md:mb-0'>
          <SelectCem
            churchId={churchId}
            errors={false}
            title={'Escolha uma Rede'}
            name='cem'
            control={control}
          />
        </div>
        <div className='flex w-full max-w-md'>
          <RadioInput
            name='accepted'
            control={control}
            options={optionAccepted}
          />
        </div>
        <div className='flex flex-col w-full max-w-md'>
          <p className='mt-3 text-lg font-medium'>Batizado?</p>
          <div className='mt-1'>
            <RadioInput
              name='baptism'
              control={control}
              options={optionBapstism}
            />
          </div>
        </div>

        <div className='flex'>
          <div className='w-full mt-5 mb-6 md:w-full md:mb-0'>
            <ButtonSubmit text='Salvar' type='submit' />
          </div>
        </div>
      </form>
    </div>
  )
}

export default AceitouJesus
