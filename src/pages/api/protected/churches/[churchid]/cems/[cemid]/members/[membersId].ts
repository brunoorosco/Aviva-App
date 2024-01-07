import type { NextApiRequest, NextApiResponse } from 'next'
import { getMembers, getMembersById } from '@/infra/services/members'
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
    const { churchid, cemid, membersId } = req.query

    const members = await getMembersById(
      churchid as string,
      cemid as string,
      membersId as string
    )

    return res.status(200).json(members)
  }
  return res.status(200).json([])
}
