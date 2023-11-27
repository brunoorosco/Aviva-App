import { NextApiRequest, NextApiResponse } from 'next'
import { batismo } from './docGoogle'

type Data = {
  id: string
  church: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data[]>) => {
  try {
    if (req.method === 'GET') {
      const sheet = await batismo()
      const rows = await sheet.getRows()
      const datas: any[] = await rows.map((row: any) => {
        return {
          id: row.get('id'),
          church: row.get('church')
        }
      })
      return res.status(200).json(datas)
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
