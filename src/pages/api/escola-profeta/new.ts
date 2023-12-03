import { NextApiRequest, NextApiResponse } from 'next'
import { escolaProfeta } from '../docGoogle'
import crypto from 'node:crypto'

type Data = {
  name: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    if (req.method === 'POST') {
      const sheet = await escolaProfeta()
      const response = await sheet.addRow({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        church: req.body.church,
        qrcode: crypto.randomUUID()
      })

      res.status(201).json({ name: 'teste' })
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
