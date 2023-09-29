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

type FormValues = {
  name: string
  email: string
  phone: string
  tribe: string
}
const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const AceitouJesus = () => {
  const [form, setForm] = useState({
    tribe: ''
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()
  const { data, error } = useSWR('/api/tribes', fetcher)
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
    <div className='md:w-full max-h-screen h-screen'>
      <div className='text-center pt-3'>
        <p className='text-xl font-semibold'>Aceitou/Reconciliou</p>
      </div>
      <div className='pt-6'>
        <form onSubmit={onSubmit}>
          <TextInput
            {...register('name', { required: true })}
            name='name'
            placeholder='Nome Completo'
            mask={(e: string) => Masks.inputName(e)}
            control={control}
            error={errors.name ? 'Preenchimento Obrigatório' : ''}
          />
          <TextInput
            {...register('email')}
            name='email'
            placeholder='E-mail'
            control={control}
          />
          <TextInput
            {...register('phone', { required: true })}
            name='phone'
            placeholder='WhatsApp'
            mask={(e: string) => Masks.phone(e)}
            control={control}
            error={errors.phone ? 'Preenchimento Obrigatório' : ''}
          />
          <Select
            options={data}
            title={'Escolha uma Rede'}
            value={form.tribe}
            onChange={(event: any) =>
              setForm((currenty) => {
                return { ...currenty, tribe: event.target.value }
              })
            }
          />
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

          <div className='flex justify-center'>
            <button
              className='p-4 block shadow bg-gray-500 my-2 rounded w-full max-w-md m-2 font-bold'
              type='submit'
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AceitouJesus
