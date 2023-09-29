import React, { useState } from 'react'
import axios from 'axios'
import Toast from '@/components/Toast'
import Image from 'next/image'
import logo from '@/public/logo-preto.png'
import TextInput from '@/components/Input'
import { Masks } from '@/utils/masks'
import Select from '@/components/Select'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'

const churchName = [
  { value: 'sede', label: 'Sede' },
  { value: 'guarulhos', label: 'Guarulhos' },
  { value: 'itaqua1', label: 'Itaqua I' },
  { value: 'sapopemba', label: 'Sapopemba' },
  { value: 'suzano', label: 'Suzano' },
  { value: 'itaqua2', label: 'Itaqua II' },
  { value: 'itu', label: 'Itu' },
  { value: 'curitiba', label: 'Curitiba' }
]

type FormValues = {
  name: string
  email: string
  phone: string
  tribe: string
}
const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()
  const [form, setForm] = useState({
    tribe: ''
  })
  const [erro, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data, error } = useSWR('/api/tribes', fetcher)
  // async function handleSubmit(evt: any) {
  //   evt.preventDefault()
  //   try {
  //     const response = await axios.post('/api/escola-profeta/new', form)
  //     if (response.status === 201) {
  //       Toast.showSuccess(
  //         `${response.data.name}, sua inscrição foi realizada com sucesso!!!`
  //       )
  //       setForm({ name: '', email: '', phone: '', church: '' })
  //     }
  //   } catch (error) {
  //     Toast.showError('Não foi possível completar sua inscrição')
  //   }
  // }
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setError('')
      const response = await axios.post('/api/escola-profeta/new', data)
      console.log('[LOGIN_ERROR]: ', data)

      setIsLoading(false)
      if (response.status === 201) {
        Toast.showSuccess(
          `${response.data.name}, sua inscrição foi realizada com sucesso!!!`
        )
        // setForm({ name: '', email: '', phone: '', church: '' })
      }

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
    <div className='md: w-full bg-gray-200 max-h-screen h-screen'>
      <div className='justify-center text-center flex'>
        <Image className='mt-5' alt='logo' src={logo} width={200} />
      </div>
      <div className='text-center pt-3'>
        <p className='text-xl font-semibold'>Inscrição escola de Profeta</p>
        <p className='text-base'>Valor R$ 50,00</p>
        <p className='text-base'>
          Pix para pagamentos CNPJ: 23.077.271/0001-40
        </p>
      </div>
      <form onSubmit={onSubmit}>
        <div className='pt-6'>
          <div className='container mx-auto text-center'>
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

            <div className='flex justify-center'>
              <button
                className='p-4 block shadow bg-gray-500 my-2 rounded w-full max-w-md m-2 font-bold'
                type='submit'
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Index
