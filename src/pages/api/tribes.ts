import { NextApiRequest, NextApiResponse } from 'next'
import { getDoc } from './docGoogle'

type Data = {
  value: string
  label: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data[]>) => {
  try {
    if (req.method === 'GET') {
      let sheet
      const tribes: Data[] = await getDoc().then(async (doc) => {
        sheet = doc.sheetsByTitle['tribes']
        const rows = await sheet.getRows()
        return await rows.map((row) => {
          return {
            value: row.id,
            label: row.tribes
          }
        })
      })
      return res.status(200).json(tribes)
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
