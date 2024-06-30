import { NextApiRequest, NextApiResponse } from 'next'
import { batismo } from '@/infra/google/accessGoogle'
import { orderByName } from '@/utils/orderBy'
import { paginationArray } from '@/utils/paginationArray'

const PERPAGE = 10

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const page = req.query.page as string
    const sheet = await batismo()
    const rows = await sheet.getRows()
    const users = await rows.map((row) => {
      return {
        name: row.get('Nomes'),
        date: row.get('data'),
        cem: row.get('CEM')
      }
    })
    const orderUsers = orderByName(users)
    const userPage = paginationArray(orderUsers, page, PERPAGE)
    res.setHeader('page', page)
    res.setHeader('items', users.length)
    res.setHeader('perPage', PERPAGE)
    return res.status(200).json(userPage)
  } catch (error) {
    throw new Error(error as string)
  }
}
