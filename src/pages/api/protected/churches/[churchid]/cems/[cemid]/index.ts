import type { NextApiRequest, NextApiResponse } from 'next'
import { CEM } from '@prisma/client'
import { deleteCem, findCemById } from '@/infra/services/cems'
import { getUsersByCem } from '@/infra/services/users'

interface Error {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CEM[] | CEM | Error | null>
) {
  const churchId = req.query.churchid as string
  const cemId = req.query.cemid as string
  if (req.method == 'GET') {
    const cem = await getUsersByCem(cemId)
    return res.status(200).json(cem)
  }
  if (req.method == 'DELETE') {
    const cemDelete = await deleteCem(churchId, cemId)
    return res.status(200).json(cemDelete)
  }
  // if (!cem) {
  //   return res.status(400).json({ message: `CEM [${cemId}] not found.` })
  // }
}
