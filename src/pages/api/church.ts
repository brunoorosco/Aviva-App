import { NextApiRequest, NextApiResponse } from 'next'
import { getDoc } from './docGoogle'

type Data = {
  id: string
  church: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data[]>) => {
  try {
    if (req.method === 'GET') {
      let sheet
      const churches: Data[] = await getDoc().then(async (doc) => {
        sheet = doc.sheetsByTitle['church']
        const rows = await sheet.getRows()
        return await rows.map((row) => {
          return {
            id: row.id,
            church: row.church
          }
        })
      })
      return res.status(200).json(churches)
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
