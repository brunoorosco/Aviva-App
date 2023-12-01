import type { NextApiRequest, NextApiResponse } from 'next'
import { CEM, User } from '@prisma/client'
import { updatedUserCem } from '@/infra/services/users'

type CemId = {
  id: String
}
type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | User | Error>
) {
  if (req.method === 'PATCH') {
    const { userid } = req.query
    const { cem } = req.body
    const user = await updatedUserCem(cem as string, userid as string)

    return res.status(200).json(user)
  }

  return res.status(200).json([])
}
