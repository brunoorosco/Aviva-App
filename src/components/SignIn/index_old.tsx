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
    <div className='flex bg-zinc-700'>
      <div className='bg-right bg-cover xl:w-3/4'>
        <img src='/banner2024.jpg' className='hidden h-full xl:block ' />
      </div>
      <div className='mx-auto'>
        <form onSubmit={onSubmit}>
          <div className='flex flex-col w-100 h-[calc(100dvh)] items-center p-10'>
            <div className='block'>
              <img
                src='/logo-branco.png'
                width='70%'
                className='mx-auto my-16'
              />
            </div>
            <div className='w-full mb-1'>
              <input
                {...register('email', { required: true })}
                name='email'
                placeholder='Email'
                className='min-w-full p-3 mt-3 text-gray-700 border rounded text-1xl '
              />
              {errors.email && errors.email.type === 'required' && (
                <p className='block mt-2 text-sm text-red-400'>
                  E-mail é obrigatório
                </p>
              )}
            </div>
            <div className='w-full mb-4 '>
              <input
                {...register('password', { required: true, minLength: 6 })}
                type='password'
                name='password'
                placeholder='Password'
                className='min-w-full p-3 mt-3 text-gray-900 border rounded text-1xl '
              />
              {errors.password && errors.password.type === 'required' && (
                <p className='block mt-2 text-sm text-red-400'>
                  Senha é Obrigatória
                </p>
              )}
              {errors.password && errors.password.type === 'minLength' && (
                <p className='block mt-2 text-sm text-red-400'>
                  6 digitos no mínimo
                </p>
              )}
              {error && (
                <span className='block mt-2 text-sm text-red-400'>{error}</span>
              )}
            </div>
            <ButtonSubmit text='Entrar' type='submit' loading={isLoading} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
