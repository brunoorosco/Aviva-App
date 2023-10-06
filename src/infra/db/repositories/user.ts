import { prisma } from '@/infra/db/prismaClient'
type TCredential = {
  email: string
}

export class User {
  async autenticade(credentials: TCredential): Promise<any> {
    const userDb = await prisma.user.findFirst({
      where: {
        email: credentials.email
      },
      include: {
        UserCEM: {
          select: {
            cem: {
              select: {
                id: true,
                ChurchesCEM: {
                  select: {
                    churches: { select: { id: true } }
                  }
                }
              }
            }
          }
        }
      }
    })
    if (userDb) {
      const userData = {
        id: userDb.id,
        email: userDb.email,
        name: userDb.name,
        birthday: userDb.birth,
        password: userDb.password,
        cemId: userDb.UserCEM[0].cem.id,
        churchId: userDb.UserCEM[0].cem.ChurchesCEM[0].churches.id
      }
      return userData
    }
    return null
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
