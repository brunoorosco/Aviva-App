import { withAudit } from '@/middlewares/withAudit';
import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@/domain/models/users'
import { createUser } from '@/services/users';

type Error = {
  message: string
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | User[]
    | User
    | Error
    | { data: User[]; total: number; page: number; totalPages: number }
  >
) {
  if (req.method === 'POST') {
    const params = req.body
    const members = await createUser({
      churchId: req.query.churchid,
      active: true,
      ...params
    })

    return res.status(201).json(members)
  }
  return res.status(200).json([])
}

export default withAudit(handler);