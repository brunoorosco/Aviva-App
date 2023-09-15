import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loading } from '../Loading'

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
    <div className="flex  bg-zinc-700">
      <div className="bg-cover bg-right xl:w-full">
        <img src="/lg-banner.png" className="h-full hidden xl:block " />
      </div>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col w-100 h-[calc(100dvh)] mx-8">
          <div className="block">
            <img src="/logo-branco.png" width="70%" className="mx-auto my-16" />
          </div>
          <div className="w-full mb-1">
            <input
              {...register('email', { required: true })}
              name="email"
              placeholder="Email"
              className="p-3 mt-3 text-1xl border rounded min-w-full text-gray-700"
            />
            {errors.email && errors.email.type === 'required' && (
              <p className="text-red-400 text-sm block mt-2">
                E-mail é obrigatório
              </p>
            )}
          </div>
          <div className=" w-full mb-1">
            <input
              {...register('password', { required: true, minLength: 6 })}
              type="password"
              name="password"
              placeholder="Password"
              className="p-3 mt-3 text-1xl border rounded min-w-full text-gray-900"
            />
            {errors.password && errors.password.type === 'required' && (
              <p className="text-red-400 text-sm block mt-2">
                Senha é Obrigatória
              </p>
            )}
            {errors.password && errors.password.type === 'minLength' && (
              <p className="text-red-400 text-sm block mt-2">
                6 digitos no mínimo
              </p>
            )}
          </div>
          <div className="block w-full">
            {error && (
              <span className="text-red-400 text-sm block mt-2">{error}</span>
            )}
            <button
              type="submit"
              className={`p-3 text-1xl text-center border font-semibold  rounded border-green-700 
                            bg-lime-500 mt-3 min-w-full ${
                              isLoading
                                ? 'cursor-not-allowed opacity-85'
                                : 'hover:bg-lime-400'
                            }`}
            >
              <div> {isLoading ? <Loading /> : 'Entrar'}</div>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignIn
