import { NextApiRequest, NextApiResponse } from 'next'
import { getDoc } from '../docGoogle'

const { GoogleSpreadsheet } = require('google-spreadsheet')
const crypto = require('node:crypto')

type Data = {
  name: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    if (req.method === 'POST') {
      const doc = await getDoc()
      const sheet = doc.sheetsByTitle['escola-profeta-insc']
      const response = await sheet.addRow({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        church: req.body.church,
        qrcode: crypto.randomUUID()
      })

      res.status(201).json({ name: response.name })
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
