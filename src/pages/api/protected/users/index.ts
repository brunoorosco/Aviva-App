import { getAllUsers } from '@/infra/db/repositories/users'
import { createUser } from '@/infra/services/users'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method == 'POST') {
      const user = await createUser(req.body)
      res.status(201).json({ user })
    } else if (req.method == 'GET') {
      const users = await getAllUsers()
      res.send(users)
    } else {
      res.send('')
    }
  } catch (error) {
    console.log(error.message)
    throw new Error('Falha ao cadastrar o usuário')
    res.status(400).json({ error: 'Falha ao cadastrar o usuário' })
  }
}
