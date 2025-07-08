import type { NextApiRequest, NextApiResponse } from 'next'
import { getMembers } from '@/infra/services/members'
import { createUser } from '@/infra/services/users'

type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[] | Error>
) {
  if (req.method === 'GET') {
    const cemid = req.query.cemid as string
    const members = await getMembers(cemid as string)

    return res.status(200).json(members)
  } else if (req.method === 'POST') {
    const params = req.body
    const members = await createUser({
      churchId: req.query.churchid,
      cemId: req.query.cemid,
      ...params
    })

    return res.status(201).json(members)
  }
  return res.status(200).json([])
}
