import type { NextApiRequest, NextApiResponse } from 'next'
import { CEM } from '@prisma/client'
import {
  getUserSupervisories,
  getUserSupervisoriesCem
} from '@/infra/services/users'

type CemId = {
  id: String
}
type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CEM[] | CEM | CemId | Error>
) {
  if (req.method === 'GET') {
    const { churchid, cemid } = req.query

    const supervisories = await getUserSupervisoriesCem(
      churchid as string,
      cemid as string
    )

    return res.status(200).json(supervisories)
  }

  return res.status(200).json([])
}
