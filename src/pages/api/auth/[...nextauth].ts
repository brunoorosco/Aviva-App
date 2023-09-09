import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/infra/db/prisma/prismaClient'
import { Account } from '@/repositories/account'
import { randomBytes, randomUUID } from 'node:crypto'

const acount = new Account()
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credencials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Passsword', type: 'password' }
      },
      async authorize(credentials) {
        const user = {
          id: '1',
          email: 'user@email.com',
          password: '123',
          name: 'User HardCode',
          role: 'admin'
        }
        const teste = await acount.autenticade({ email: user.email })

        if (
          credentials?.email == 'test@gmail.com' &&
          credentials?.password == '123'
        ) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin' // Página de login personalizada
    // signOut: '/auth/signout', // Página de logout personalizada
    // error: '/auth/error', // Página de erro de autenticação personalizada
    // verifyRequest: '/auth/verify-request', // Página de verificação de solicitação personalizada
    // newUser: '/auth/newuser' // Página de criação de novo usuário personalizada
  },
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user)
      return token
    },
    async session({ session, token }) {
      // Adicione informações personalizadas à sessão, se necessário
      session.user = token.user as any
      return session
    },

    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  }
  // session: {
  //   // Choose how you want to save the user session.
  //   // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
  //   // If you use an `adapter` however, we default it to `"database"` instead.
  //   // You can still force a JWT session by explicitly defining `"jwt"`.
  //   // When using `"database"`, the session cookie will only contain a `sessionToken` value,
  //   // which is used to look up the session in the database.
  //   strategy: 'database',

  //   // Seconds - How long until an idle session expires and is no longer valid.
  //   maxAge: 30 * 24 * 60 * 60, // 30 days

  //   // Seconds - Throttle how frequently to write to database to extend a session.
  //   // Use it to limit write operations. Set to 0 to always update the database.
  //   // Note: This option is ignored if using JSON Web Tokens
  //   updateAge: 24 * 60 * 60 // 24 hours

  //   // The session token is usually either a random UUID or string, however if you
  //   // need a more customized session token string, you can define your own generate function.

  //   // generateSessionToken: () => {
  //   //   return randomUUID?.() ?? randomBytes(32).toString('hex')
  //   // }
  // }
}
export default NextAuth(authOptions)
// export { handler as GET, handler as POST }
