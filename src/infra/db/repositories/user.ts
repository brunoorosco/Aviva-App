import { prisma } from '@/infra/db/prismaClient'
type TCredential = {
  email: string
}

export class User {
  async autenticade(credentials: TCredential): Promise<any> {
    try {
      const userDb: any[] = await prisma.$queryRaw`
      SELECT * from user u 
      left join churchescem c2 on c2.cem_id = u.cem_id 
      where u.email = ${credentials.email} LIMIT 1`

      if (userDb.length > 0) {
        const userData = {
          id: userDb[0].id,
          email: userDb[0].email,
          name: userDb[0].name,
          birthday: userDb[0].birth,
          password: userDb[0].password,
          cemId: userDb[0].cem_id || '',
          churchId: userDb[0].churches_id || ''
        }
        return userData
      }
      return null
    } catch (error) {
      console.error(error)
    }
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
