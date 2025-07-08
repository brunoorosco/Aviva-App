import type { NextApiRequest, NextApiResponse } from 'next'
import { getUsersByChurch } from '@/infra/services/users'
import { User } from '@/domain/models/users'

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
  if (req.method === 'GET') {
    const { churchid } = req.query
    const users = await getUsersByChurch(churchid as string)

    return res.status(200).json(users)
  }

  return res.status(200).json([])
}
