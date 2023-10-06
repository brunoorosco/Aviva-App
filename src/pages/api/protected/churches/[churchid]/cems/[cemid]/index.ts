import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { Churches } from '@prisma/client'
import { findCemById } from '@/infra/services/cems'

interface Error {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Churches | Error>
) {
  const churchId = req.query.churchid as string
  const cemId = req.query.cemid as string

  const cem = await findCemById(churchId, cemId)

  if (!cem) {
    return res.status(400).json({ message: `CEM [${cemId}] not found.` })
  }

  return res.status(200).json(cem)
}
