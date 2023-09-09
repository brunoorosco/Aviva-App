import { SyntheticEvent, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, redirect } from 'next/navigation'

const SignIn = () => {
  const router = useRouter()
  const session = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (session) {
    redirect('/app')
  }

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault()

    try {
      const response = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      console.log('[LOGIN_RESPONSE]: ', response)

      if (response?.error) {
        setError('Email ou senha inválidos')
        return
      }
      router.replace('/app')
    } catch (error) {
      console.log('[LOGIN_ERROR]: ', error)
    }
  }

  return (
    <div className="container-fluid mx-auto">
      <div className="flex h-screen bg-zinc-700">
        <div className="bg-cover bg-right w-full">
          <img src="/lg-banner.png" className="h-full" />
        </div>

        <form onSubmit={handleLogin}>
          <div className="flex flex-col w-100 justify-center h-screen mx-8">
            <div className="block">
              <img src="/logo.png" width="70%" className="mx-auto" />
            </div>
            <div className="w-full mb-1">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                name="email"
                placeholder="Email"
                className="p-3 mt-3 text-1xl border rounded min-w-full text-gray-700"
              />
            </div>
            <div className=" w-full mb-1">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                placeholder="Password"
                className="p-3 mt-3 text-1xl border rounded min-w-full text-gray-900"
              />
            </div>
            <div className="block w-full">
              {error && (
                <span className="text-red-400 text-sm block mt-2">{error}</span>
              )}
              <button
                type="submit"
                className="p-3 text-1xl text-center border rounded border-green-700 
                                    hover:bg-green-500 bg-lime-500 mt-3 min-w-full"
              >
                Entrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
