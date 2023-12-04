import { escolaProfeta } from '@/infra/google/accessGoogle'
import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
  phone: string
  id: string
  email: string
  church: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data[]>) => {
  try {
    if (req.method === 'GET') {
      const sheet = await escolaProfeta()
      const rows = await sheet.getRows()
      const users = await rows.map((row) => {
        return {
          id: row.get('qrcode'),
          name: row.get('name'),
          phone: row.get('phone'),
          email: row.get('email'),
          church: row.get('church')
        }
      })
      return res.status(200).json(users)
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
