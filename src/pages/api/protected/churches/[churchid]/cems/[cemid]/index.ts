import type { NextApiRequest, NextApiResponse } from 'next'
import { getUsersByCem } from '@/services/users'
import { CellsModel } from '@/domain/models/cells'
import { deleteCemService } from '@/services/cemService'

interface Error {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | null>
) {
  const churchId = req.query.churchid as string
  const cemId = req.query.cemid as string
  const name = req.query.name as string

  if (req.method == 'GET') {
    const cem = await getUsersByCem(cemId, name)
    return res.status(200).json(cem)
  }
  if (req.method == 'DELETE') {
    const cemDelete = await deleteCemService(churchId, cemId)
    return res.status(200).json(cemDelete)
  }
  // if (!cem) {
  //   return res.status(400).json({ message: `CEM [${cemId}] not found.` })
  // }
}
