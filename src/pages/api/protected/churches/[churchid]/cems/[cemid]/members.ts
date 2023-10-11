import type { NextApiRequest, NextApiResponse } from 'next'
import { getMembers } from '@/infra/services/members'
import { TMembers } from '@/infra/db/repositories/members'

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
    console.log(members)

    return res.status(200).json(members)
  }

  return res.status(200).json([])
}
