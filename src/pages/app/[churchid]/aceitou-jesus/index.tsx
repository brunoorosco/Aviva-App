import React, { useState } from 'react'
import axios from 'axios'
import Toast from '@/components/Toast'
import Image from 'next/image'
import logo from '@/../public/logo-preto.png'
import TextInput from '@/components/Input'
import { Masks } from '@/utils/masks'
import Select from '@/components/Select'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { SelectSupervisor } from '@/components/Select/SelectSupervisores'
import ButtonSubmit from '@/components/ButtonSubmit'

type FormValues = {
  name: string
  email: string
  phone: string
  cem: string
}
const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const AceitouJesus = () => {
  const { data: session } = useSession()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()
  const { data, error } = useSWR(
    `/api/protected/churches/${session?.user.churchId}/cems`,
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
      setIsLoading(true)
      setError('')
      console.log('[LOGIN_ERROR]: ', data)

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

      <form className='px-1 mt-5 text-black max-md:w-full' onSubmit={onSubmit}>
        <div className='w-full mt-2 mb-2 md:mb-0'>
          <TextInput
            {...register('name', { required: true })}
            name='name'
            className='placeholder:text-gray-600'
            placeholder='Nome Completo'
            control={control}
            error={errors.name ? 'Preenchimento Obrigatório' : ''}
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
            {...register('phone', { required: true })}
            name='phone'
            placeholder='WhatsApp'
            mask={(e: string) => Masks.phone(e)}
            control={control}
            error={errors.phone ? 'Preenchimento Obrigatório' : ''}
          />
        </div>
        <div className='w-full mb-3 md:w-2/3 md:mb-0'>
          <SelectSupervisor
            errors={false}
            title={'Escolha uma Rede'}
            name='cem'
            control={control}
          />
        </div>
        <div className='flex w-full max-w-md'>
          <div className='flex items-center mr-4'>
            <input
              id='inline-radio'
              type='radio'
              defaultValue='true'
              defaultChecked={true}
              name='inline-radio-group'
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            />
            <label
              htmlFor='inline-radio'
              className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              Aceitou
            </label>
          </div>
          <div className='flex items-center mr-4'>
            <input
              id='inline-2-radio'
              type='radio'
              defaultValue=''
              name='inline-radio-group'
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            />
            <label
              htmlFor='inline-2-radio'
              className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              Reconciliou
            </label>
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
