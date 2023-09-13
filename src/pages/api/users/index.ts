import { getAllUsers } from '@/infra/db/repositories/users'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users = await getAllUsers()
    console.log(users)

    res.send(users)
  } catch (e) {
    console.error(e)
  }
}
