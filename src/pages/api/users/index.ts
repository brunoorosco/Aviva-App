import { prisma } from '@/infra/db/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log(req)
    const users = await prisma.user.findMany()
    console.log(users)

    res.send(users)
  } catch {
    ;(e: Error) => {
      console.error(e.stack)
    }
  }
}
