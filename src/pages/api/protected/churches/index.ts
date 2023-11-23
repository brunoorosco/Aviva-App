import type { NextApiRequest, NextApiResponse } from 'next'
import { Churches } from '@prisma/client'
import {
  findChurchesById,
  findChurches,
  createChurch
} from '@/infra/services/churches'

interface ChurchesId {
  id: String
}

interface Error {
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const saved = await createChurch(req.body)
    return res.status(200).json(saved)
  }

  if (req.method === 'GET') {
    const { churchid } = req.query

    if (churchid) {
      const church = await findChurchesById(churchid as string)

      if (!church) {
        return res.status(404).json({ message: 'Church invalid' })
      }

      return res.status(200).json(church)
    }

    const churches = await findChurches()

    return res.status(200).json(churches)
  }

  return res.status(200).json([])
}
