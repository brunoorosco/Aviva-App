import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/infra/db/prismaClient'
import { getSession } from 'next-auth/react'
import { Churches } from '@prisma/client'
import { findChurchesById } from '@/infra/services/churches'
import { createCem } from '@/infra/services/cems'

interface SessionError {
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Churches | SessionError>
) {
  const session = await getSession({ req })

  if (session) {
    const churchId = req.query.churchid as string
    const church = await findChurchesById(churchId)

    if (!church) {
      return res
        .status(200)
        .json({ message: `Church [${churchId}] not found.` })
    }

    return res.status(200).json(church)
  }
  return res.status(200).json({ message: 'You need be auth.' })
}
