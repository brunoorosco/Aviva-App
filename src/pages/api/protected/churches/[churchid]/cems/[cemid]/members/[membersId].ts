import type { NextApiRequest, NextApiResponse } from 'next'
import { getMembersById } from '@/services/members'

type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[] | Error>
) {
  if (req.method === 'GET') {
    const { churchid } = req.query
    const user = await getMembersById(
      churchid as string
    )

    return res.status(200).json(user)
  }
  return res.status(200).json([])
}
