import { NextApiRequest, NextApiResponse } from 'next'

const { GoogleSpreadsheet } = require('google-spreadsheet')
const crypto = require('node:crypto')

type Data = {
  name: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    if (req.method === 'POST') {
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_ID)

      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join(
          '\n'
        )
      })

      await doc.loadInfo() //carrega as infos da planilha
      //select sheet escola-profeta-insc
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
