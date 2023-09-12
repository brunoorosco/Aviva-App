import { prisma } from '@/infra/db/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users = await prisma.user.findMany()

    res.send(users)
  } catch {
    ;(e: Error) => {
      console.error(e)
    }
  }
}
