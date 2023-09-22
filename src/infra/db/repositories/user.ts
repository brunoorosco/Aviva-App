import { prisma } from '@/infra/db/prismaClient'
type TCredential = {
  email: string
}

export class User {
  async autenticade(credentials: TCredential): Promise<any> {
    const user = await prisma.user.findFirst({
      where: {
        email: credentials.email
      },
      include: {
        UserCEM: {
          include: {
            cem: { include: { ChurchesCEM: { include: { churches: true } } } }
          }
        }
      }
    })
    console.log(user?.UserCEM[0].cem.ChurchesCEM[0].churches)
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
