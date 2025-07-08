import { User } from '@/domain/models/users'
import type { NextApiRequest, NextApiResponse } from 'next'

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

    return res.status(200).json({ message: 'ok' })
  }

  return res.status(200).json([])
}
