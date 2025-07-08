import { createUser } from '@/infra/services/users'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method == 'POST') {
      const user = await createUser(req.body)
      res.status(201).json({ user })
    } else if (req.method == 'GET') {
      // const users = await getAllUsersByProfile()
      res.send({ message: 'ok' })
    } else {
      res.send('')
    }
  } catch (error) {
    //@ts-ignore
    console.error(error)
    res.status(400).json({ error: 'Falha na conexão com tb usuário' })
  }
}
