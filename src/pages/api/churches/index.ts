import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/infra/db/prismaClient'
import { getSession } from 'next-auth/react'
import { Prisma, Churches } from '@prisma/client'
import {
  create,
  findChurchesById,
  findChurches
} from '@/infra/services/churches'

interface ChurchesId {
  id: String
}

interface SessionError {
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Churches[] | Churches | ChurchesId | SessionError>
) {
  const session = await getSession({ req })

  if (session) {
    if (req.method === 'POST') {
      const newData: Prisma.ChurchesCreateInput = {
        name: req.body.name
      }
      const saved = await create(newData)

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
  }

  return res.status(200).json([])
}
