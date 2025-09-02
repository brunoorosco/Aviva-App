'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import useSWR from 'swr'
import axios from 'axios'
import Image from 'next/image'
import Toast from '@/components/Toast'
import { Input } from '@/components/ui/input'
import { Masks } from '@/utils/masks'
import logo from '@/public/logo-preto.png'
import Select from '@/components/Select'

type FormValues = {
  name: string
  email?: string
  phone: string
  tribe: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const Index = () => {
  const { control, handleSubmit } = useForm<FormValues>()
  const [isLoading, setIsLoading] = useState(false)
  const { data: tribes, error } = useSWR('/api/tribes', fetcher)

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      const response = await axios.post('/api/escola-profeta/new', data)
      setIsLoading(false)

      if (response.status === 201) {
        Toast.showSuccess(`${response.data.name}, sua inscrição foi realizada com sucesso!`)
      }
    } catch (err) {
      setIsLoading(false)
      console.error('[SUBMIT_ERROR]:', err)
      Toast.showError('Erro durante a inscrição.')
    }
  })

  return (
    <div className='w-full bg-gray-200 min-h-screen'>
      <div className='flex justify-center mt-5'>
        <Image alt='logo' src={logo} width={200} />
      </div>
      <div className='text-center pt-3'>
        <p className='text-xl font-semibold'>Inscrição escola de Profeta</p>
        <p className='text-base'>Valor R$ 50,00</p>
        <p className='text-base'>Pix para pagamentos CNPJ: 23.077.271/0001-40</p>
      </div>

      <form onSubmit={onSubmit} className='pt-6'>
        <div className='container mx-auto max-w-md flex flex-col gap-4'>
          {/* Nome */}
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
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
              <Input {...field} placeholder='E-mail' className='w-full' />
            )}
          />

          {/* WhatsApp */}
          <Controller
            name='phone'
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                placeholder='WhatsApp'
                className='w-full'
                onChange={(e) => field.onChange(Masks.phone(e.target.value))}
              />
            )}
          />

          {/* Seleção de Tribo */}
          <Controller
            name='tribe'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                options={tribes || []}
                title='Escolha uma Rede'
                value={field.value}
                onChange={(e: any) => field.onChange(e.target.value)}
              />
            )}
          />

          <button
            type='submit'
            className='p-4 bg-gray-500 rounded w-full font-bold mt-4'
            disabled={isLoading}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Index
