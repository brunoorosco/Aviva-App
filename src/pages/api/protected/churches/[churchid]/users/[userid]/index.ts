import { User } from '@/domain/models/users'
import { changeStatusUser, updateMember } from '@/services/members'
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
    const members = await updateMember(userid as string, req.body)

    return res.status(200).json({ message: 'ok' })
  } else if (req.method === 'PUT') {
    const { userid } = req.query

    return res.status(200).json({ message: 'ok' })
  }

  return res.status(200).json([])
}
