import { prisma } from '@/infra/db/prisma/prismaClient'
type TCredential = {
  email: string
}

export class User {
  async autenticade(credentials: TCredential): Promise<any> {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email
      }
    })
    console.log(user)
    return user
  }

  async checkByEmail(email: string): Promise<any> {
    const isValid = await prisma.user.findUnique({
      where: {
        email
      }
    })
    return isValid
  }
}
