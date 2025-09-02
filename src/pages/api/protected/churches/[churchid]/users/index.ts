import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@/domain/models/users'
import { addUserImportService } from '@/services/members'
import { getUsersByChurch } from '@/services/users'

type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | User[]
    | User
    | Error
    | { data: User[]; total: number; page: number; totalPages: number }
  >
) {
  if (req.method === 'GET') {
    try {
      const { churchid, page = 1, limit = 10, name } = req.query

      const pageNumber = parseInt(page as string, 10)
      const limitNumber = parseInt(limit as string, 10)

      const users = await getUsersByChurch(
        churchid as string,
        pageNumber,
        limitNumber,
        name as string
      )

      return res.status(200).json(users)
    } catch (error) {
      console.error('Erro ao buscar usuários com paginação:', error)
      return res.status(500).json({ message: 'Erro interno no servidor' })
    }
  } else if (req.method === 'POST') {
    const params = req.body
    const members = await addUserImportService(req.query.churchid as string, {
      ...params
    })

    return res.status(201).json({ message: 'ok' })
  }

  return res.status(200).json([])
}
