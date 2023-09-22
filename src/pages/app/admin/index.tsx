import TextInput from '@/components/Input'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loading } from '@/components/Loading'
import { useState } from 'react'
import axios from 'axios'
import ButtonSubmit from '@/components/ButtonSubmit'

type FormValues = {
  church: string
  zipcode: string
  address: string
  number: string
  city: string
}

const Admin = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    <div className="flex flex-col items-center mt-10 md:mt-5 p-3">
      <div className="text-center w-full max-w-lg content-center ">
        <div className="w-full md:w-full px-3 mb-2 md:mb-0 ">
          <label className="text-2xl md:text-3xl">Cadastro de Igrejas</label>
        </div>
      </div>
      <form className="w-full max-w-lg mt-5" onSubmit={onSubmit}>
        <div className="flex">
          <div className="w-full md:w-full px-3 mb-2 md:mb-0">
            <TextInput
              {...register('church', { required: true })}
              name="church"
              placeholder="Nome da igreja"
              control={control}
              error={errors.church ? 'Preenchimento Obrigatório' : ''}
            />
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="w-2/3 md:w-2/3 px-3 mb-3 md:mb-0">
            <TextInput
              name="address"
              placeholder="Logradouro"
              control={control}
            />
          </div>
          <div className="w-1/3 md:w-1/3 px-3">
            <TextInput name="number" placeholder="Nº" control={control} />
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="w-full md:w-2/3 px-3 mb-3 md:mb-0">
            <TextInput name="city" placeholder="Cidade" control={control} />
          </div>

          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <TextInput placeholder="CEP" name="zipcode" control={control} />
          </div>
        </div>
        <div className="flex">
          <div className="w-full md:w-full mb-6 md:mb-0">
            <ButtonSubmit text="Salvar" type="submit" />
          </div>
        </div>
      </form>
    </div>
  )
}

export default Admin
