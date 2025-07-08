import {
  createChurchService,
  getChurchByIdService,
  getChurchService
} from '@/infra/services/churchService'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const saved = await createChurchService(req.body)
    return res.status(200).json(saved)
  }

  if (req.method === 'GET') {
    const { churchid } = req.query

    if (churchid) {
      const church = await getChurchByIdService(churchid as string)

      if (!church) {
        return res.status(404).json({ message: 'Church invalid' })
      }
      return res.status(200).json(church)
    }

    const churches = await getChurchService()

    return res.status(200).json(churches)
  }

  return res.status(204)
}
