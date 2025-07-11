import { User } from '@/domain/models/users'
import { updateMember } from '@/infra/services/members'
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
    const { active } = req.body

    const members = await updateMember(userid as string, active)

    return res.status(200).json({ message: 'ok' })
  }

  return res.status(200).json([])
}
