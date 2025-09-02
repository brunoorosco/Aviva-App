import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserByName, getUsersByChurch } from '@/infra/services/users'
import { User } from '@/domain/models/users'
import { addUserImportService } from '@/infra/services/members'

type CemId = {
  id: String
}
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
      const { churchid, name } = req.query
      const users = await getUserByName(churchid as string, name as string)
      return res.status(200).json(users)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return res.status(500).json({ message: 'Erro interno no servidor' })
    }
  }
  return res.status(200).json([])
}
