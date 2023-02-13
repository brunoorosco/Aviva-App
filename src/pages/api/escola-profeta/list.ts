import { NextApiRequest, NextApiResponse } from 'next'
import { getDoc } from '../docGoogle'

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
      let sheet
      getDoc().then(async (doc) => {
        sheet = doc.sheetsByTitle['escola-profeta-insc']
        const rows = await sheet.getRows()
        const qrcode: Data[] = await rows.map((row) => {
          return {
            id: row.qrcode,
            name: row.name,
            phone: row.phone,
            email: row.email,
            church: row.church
          }
        })

        return res.status(200).json(qrcode)
      })
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
