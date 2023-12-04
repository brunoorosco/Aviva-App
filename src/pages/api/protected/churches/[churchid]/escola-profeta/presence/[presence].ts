import { chamadaEscolaProfeta } from '@/infra/google/accessGoogle'
import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

type Error = {
  error: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const data = new Date()
      const dayClass = `${data.getUTCDate()}/${data.getMonth() + 1}`
      const sheet = await chamadaEscolaProfeta()
      const rows = await sheet.getRows()
      const users = await rows.filter(
        (row) => row.get('id') === req.query.presence
      )

      // .then((data: any[]) => {
      //   if (data.length === 0) {
      //     return false
      //   }
      //   // switch (dayClass) {
      //   //   case '8/5':
      //   //     data[0].aula6 = 'P'
      //   //     data[0].save()
      //   //     break

      //   //   case '24/4':
      //   //     data[0].aula7 = 'P'
      //   //     data[0].save()
      //   //     break

      //   //   default:
      //   //     break
      //   // }
      //   data[0].aula8 = 'P'
      //   data[0].save()
      //   return data[0].name
      // })

      return res.status(200).json({ users })
    }
  } catch (error) {
    console.error(error)
  }
}
