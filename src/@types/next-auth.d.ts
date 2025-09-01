import NextAuth, { DefaultSession } from 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id?: string
      cem:{
        _id:string
        name: string
      }
      churchId?: string
      rules?: string[]
      profileId?: number
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {}
}
