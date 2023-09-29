import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from '@/infra/db/repositories/user'
import CryptAdapter from '@/infra/cryptography/bcrypt'

const user = new User()
const cripto = new CryptAdapter()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credencials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Passsword', type: 'password' }
      },
      async authorize(credentials): Promise<any> {
        const userDb = await user.autenticade({
          email: credentials?.email || ''
        })

        if (userDb) {
          const isValidPass = cripto.compare(
            credentials?.password || '',
            userDb.password
          )
          if (!isValidPass) return null
        }

        return userDb
      }
    })
  ],
  session: {
    maxAge: 1 * 60 * 60 // 1 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user)
      return token
    },
    async session({ session, token, user }) {
      session.user = token.user as any
      return session
    },

    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        return false
      }
    }
  }
}
export default NextAuth(authOptions)
