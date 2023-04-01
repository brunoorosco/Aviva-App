import { NextApiRequest, NextApiResponse } from 'next'
import { getDoc } from '../docGoogle'

type Data = {
  name: string
  date: string
  cem: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let sheet
    const users: Data[] = await getDoc().then(async (doc) => {
      sheet = doc.sheetsByTitle['Lista-Certificado']
      const rows = await sheet.getRows()
      return await rows.map((row) => {
        return {
          name: row.Nomes,
          date: row.data,
          cem: row.CEM
        }
      })
    })
    return res.status(200).json(users)
  } catch (error) {
    throw new Error(error as string)
  }
}
