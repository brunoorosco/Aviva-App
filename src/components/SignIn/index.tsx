import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import ButtonSubmit from '../ButtonSubmit'

type FormValues = {
  password: string
  email: string
}

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()
  const router = useRouter()
  const session = useSession()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (session.status === 'authenticated') {
    router.push('/app')
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setError('')
      const response = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })

      setIsLoading(false)
      if (response?.error) {
        setError('Email ou senha inválidos')
        return
      }

      router.replace('/app')
    } catch (error) {
      setIsLoading(false)
      console.log('[LOGIN_ERROR]: ', error)
    }
  })

  return (
    <div className='flex items-center justify-center h-screen bg-zinc-800'>
      {/* Formulário centralizado */}
      <div className='w-full max-w-lg p-4 transition-all duration-300 transform border border-zinc-700 rounded-lg shadow-lg hover:shadow-2xl sm:w-full sm:p-4 sm:rounded-lg sm:shadow-md sm:m-6 max-h-[100vh]'>
        <form onSubmit={onSubmit} className='mx-6'>
          <div className='flex flex-col items-center'>
            {/* Logo */}
            <img
              src='/logo-branco.png'
              alt='Logo'
              className='w-2/3 mx-auto my-6 sm:w-1/2'
            />

            {/* Email input */}
            <div className='w-full mb-3'>
              <input
                {...register('email', { required: true })}
                type='email'
                name='email'
                placeholder='Email'
                className='w-full p-3 mt-2 text-gray-900 border border-gray-400 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500'
              />
              {errors.email && errors.email.type === 'required' && (
                <p className='mt-2 text-sm text-red-400'>
                  E-mail é obrigatório
                </p>
              )}
            </div>

            {/* Password input */}
            <div className='w-full mb-3'>
              <input
                {...register('password', {
                  required: true,
                  minLength: 6
                })}
                type='password'
                name='password'
                placeholder='Password'
                className='w-full p-3 mt-2 text-gray-900 border border-gray-400 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500'
              />
              {errors.password && errors.password.type === 'required' && (
                <p className='mt-2 text-sm text-red-400'>Senha é obrigatória</p>
              )}
              {errors.password && errors.password.type === 'minLength' && (
                <p className='mt-2 text-sm text-red-400'>6 dígitos no mínimo</p>
              )}
              {error && <p className='mt-2 text-sm text-red-400'>{error}</p>}
            </div>

            {/* Botão de envio */}
            <div className='w-full mt-3 mb-10'>
              <ButtonSubmit text='Entrar' type='submit' loading={isLoading} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
