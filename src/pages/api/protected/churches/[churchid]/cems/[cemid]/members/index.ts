import type { NextApiRequest, NextApiResponse } from 'next'
import { getMembers } from '@/infra/services/members'
import { TMembers } from '@/infra/db/repositories/members'
import { createUser } from '@/infra/services/users'

type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TMembers[] | Error>
) {
  if (req.method === 'GET') {
    const { churchid, cemid } = req.query

    const members = await getMembers(churchid as string, cemid as string)

    return res.status(200).json(members)
  } else if (req.method === 'POST') {
    const params = req.body
    const members = await createUser(params)

    return res.status(201).json(members)
  }
  return res.status(200).json([])
}
