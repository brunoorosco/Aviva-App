import type { NextApiRequest, NextApiResponse } from 'next'
import { CEM } from '@prisma/client'
import { createCem, findCem, findCemById } from '@/infra/services/cems'

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
  const churchId = req.query.churchid as string
  if (req.method === 'POST') {
    const saved = await createCem(req.body, churchId)
    return res.status(200).json(saved)
  }

  if (req.method === 'GET') {
    const { churchid } = req.query

    const cem = await findCem(churchid as string)

    return res.status(200).json(cem)
  }

  return res.status(200).json([])
}
