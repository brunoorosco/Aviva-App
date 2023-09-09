import { prisma } from '@/infra/db/prisma/prismaClient'
type TCredential = {
  email: string
}

export class User {
  async autenticade(credentials: TCredential): Promise<any> {
    const user = await prisma.user.findMany({
      // where: {
      //   email: credentials.email
      // }
    })
    return user
  }
}
