import type { NextApiRequest, NextApiResponse } from 'next'
import { getMembersByCellId } from '@/infra/services/members'
import { createUserByCem } from '@/infra/services/users'
import { User } from '@/domain/models/users'

type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | User[]
    | User
    | Error
    | { data: User[]; total: number; page: number; totalPages: number }
  >
) {
  if (req.method === 'GET') {
    const { cemid, page = 1, limit = 10 } = req.query

    const pageNumber = parseInt(page as string, 10)
    const limitNumber = parseInt(limit as string, 10)

    const members = await getMembersByCellId(
      cemid as string,
      pageNumber,
      limitNumber
    )

    return res.status(200).json(members)
  } else if (req.method === 'POST') {
    const params = req.body
    const members = await createUserByCem({
      churchId: req.query.churchid,
      cemId: req.query.cemid,
      active: true,
      ...params
    })

    return res.status(201).json(members)
  }
  return res.status(200).json([])
}
