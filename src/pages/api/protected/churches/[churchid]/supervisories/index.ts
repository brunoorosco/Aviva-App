import { CellsModel } from '@/domain/models/cells'
import type { NextApiRequest, NextApiResponse } from 'next'

type CemId = {
  id: String
}
type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CellsModel[] | CellsModel | CemId | Error>
) {
  if (req.method === 'GET') {
    const { churchid } = req.query


    return res.status(200).json({ message: 'success Supervisory' })
  }

  return res.status(200).json([])
}
