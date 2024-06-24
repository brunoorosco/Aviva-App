import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from '@/infra/db/repositories/user'
import CryptAdapter from '@/infra/cryptography/bcrypt'
import { UsersMongoRepository } from '@/infra/db/repositories/mongo/users'
import { MongoHelper } from '@/infra/db/mongoHelper'

const userRepository = new User()
const userMongoRepository = new UsersMongoRepository()
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
        const userDb = await userMongoRepository.getByEmail(credentials?.email)
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
    async session({ session, token, trigger, newSession }) {
      session.user = token.user as any
      if (trigger === 'update' && newSession?.name) {
        const userDb = await userRepository.autenticade({
          email: token.email || ''
        })

        return userDb
        session.user = token.user as any
      }
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
