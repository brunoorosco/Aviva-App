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
    const { churchid, cemid } = req.query

    const supervisories = [
      { id: '1' },
      { id: '2' }
    ]

    return res.status(200).json(supervisories as unknown as CemId)
  }

  return res.status(200).json([])
}
