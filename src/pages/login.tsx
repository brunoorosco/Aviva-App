import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

const Login = () => {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col justify-center items-center px-4 py-8 md:py-16 min-h-screen">
      <Image
        src="/logo-preto.png"
        width={180}
        height={180}
        alt="Avivamento em Cristo"
        className="mb-6"
      />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {session ? (
          <>
            <p className="text-center text-sm text-gray-700">
              Você está autenticado como <strong>{session.user?.email}</strong>
            </p>
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            {/* Botões sociais */}
            <div className="flex flex-col sm:flex-row sm:gap-3 gap-2">
              <button
                onClick={() => signIn('outlook')}
                className="flex items-center justify-center w-full px-5 py-2 text-sm font-medium text-[#4267B2] border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M504 256C504 119...z" />
                </svg>
                Entrar com Outlook
              </button>

              <button
                onClick={() => signIn('google')}
                className="flex items-center justify-center w-full px-5 py-2 text-sm font-medium text-[#DB4437] border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 488 512">
                  <path d="M488 261.8C488...z" />
                </svg>
                Entrar com Google
              </button>
            </div>

            {/* Formulário tradicional */}
            <form className="space-y-4 mt-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-fuchsia-300 focus:outline-none"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-fuchsia-300 focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2 rounded border-gray-300" />
                  Lembre-me
                </label>
                <a href="#" className="text-sm text-fuchsia-600 hover:underline">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-fuchsia-600 text-white rounded-lg hover:brightness-110 transition"
              >
                Entrar
              </button>

              <p className="text-sm text-center text-gray-500">
                Não registrado?{' '}
                <a href="/sign-up" className="text-fuchsia-600 hover:underline">
                  Criar conta
                </a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Login
