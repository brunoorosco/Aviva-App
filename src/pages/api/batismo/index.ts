import { NextApiRequest, NextApiResponse } from 'next'
import { batismo } from '../docGoogle'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sheet = await batismo()
    const rows = await sheet.getRows()
    const users = await rows.map((row) => {
      return {
        name: row.get('Nomes'),
        date: row.get('data'),
        cem: row.get('CEM')
      }
    })
    return res.status(200).json(users)
  } catch (error) {
    throw new Error(error as string)
  }
}
