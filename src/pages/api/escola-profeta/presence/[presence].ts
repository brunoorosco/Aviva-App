import { NextApiRequest, NextApiResponse } from 'next'
import { getDoc } from '../../docGoogle'

type Data = {
  name: string
}

type Error = {
  error: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  try {
    if (req.method === 'GET') {
      let sheet
      const data = new Date()
      const dayClass = `${data.getUTCDate()}/${data.getMonth() + 1}`
      const name = await getDoc()
        .then(async (doc) => {
          sheet = doc.sheetsByTitle['chamada-escola-profeta']
          const rows = await sheet.getRows()
          return await rows.filter((row) => row.id === req.query.presence)
        })
        .then((data: any[]) => {
          if (data.length === 0) {
            return false
          }
          switch (dayClass) {
            case '17/4':
              data[0].aula1 = 'P'
              data[0].save()
              break

            case '24/4':
              data[0].aula2 = 'P'
              data[0].save()
              break

            default:
              break
          }

          return data[0].name
        })

      return res.status(200).json({ name })
    }
  } catch (error) {
    console.error(error)
  }
}
