import { ChurchModel } from '@/domain/models/churchs'
import { getChurchByIdService } from '@/services/churchService'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

interface SessionError {
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChurchModel | SessionError>
) {
  const session = await getSession({ req })

  if (session) {
    const churchId = req.query.churchid as string
    const church = await getChurchByIdService(churchId)

    if (!church) {
      return res
        .status(200)
        .json({ message: `Church [${churchId}] not found.` })
    }

    return res.status(200).json(church)
  }
  return res.status(200).json({ message: 'You need be auth.' })
}
