import type { NextApiRequest, NextApiResponse } from 'next'
import { CellsModel } from '@/domain/models/cells'
import { createMinisterioService, getMinisterioService } from '@/services/ministerioService'

type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CellsModel[] | Error>
) {
  const churchId = req.query.churchid as string
  if (req.method === 'POST') {
    const saved = await createMinisterioService(req.body, churchId)
    return res.status(200).json(saved)
  }

  if (req.method === 'GET') {
    const { churchid } = req.query
    const cem = await getMinisterioService(churchid as string)
    return res.status(200).json(cem as CellsModel[])
  }

  return res.status(204)
}
