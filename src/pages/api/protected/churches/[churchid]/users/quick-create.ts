import type { NextApiRequest, NextApiResponse } from 'next'
import { UsersMongoRepository } from '@/infra/db/repositories/mongo/users'
import { withAudit } from '@/middlewares/withAudit'
import CryptAdapter from '@/infra/cryptography/bcrypt'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { churchid } = req.query
      const { name } = req.body

      if (!name) {
        return res.status(400).json({ message: 'O nome é obrigatório.' })
      }

      const userRepository = new UsersMongoRepository()
      
      const cripto = new CryptAdapter()
      const randomPass = await cripto.randonPassword()
      const setPassword = cripto.hashPassword(randomPass)

      // Creates a generic member linked to "cem", without a specific network
      const user = await userRepository.create({
        name,
        churchId: churchid as string,
        active: true,
        cem: { _id: "sem-rede", name: "CEM Padrão (Sem Rede)" },
        password: setPassword,
        permission: ["user"],
        createdAt: new Date(),
      })

      return res.status(201).json(user)
    } catch (error) {
      console.error('Erro ao criar membro rápido:', error)
      return res.status(500).json({ message: 'Erro interno no servidor' })
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}

export default withAudit(handler)
