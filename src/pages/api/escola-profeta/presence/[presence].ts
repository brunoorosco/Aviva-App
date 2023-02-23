import { NextApiRequest, NextApiResponse } from 'next'
import { getDoc } from '../../docGoogle'

type Data = {
  message: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    if (req.method === 'GET') {
      let sheet
      const data = new Date()
      const dayClass = `${data.getUTCDate()}/${data.getMonth() + 1}`

      getDoc().then(async (doc) => {
        sheet = doc.sheetsByTitle['chamada-escola-profeta']
        const rows = await sheet.getRows()
        const teste = await rows.filter(async (row) => {
          if (row.id === req.query.presence) {
            switch (dayClass) {
              case '6/3':
                row.aula1 = 'P'
                row.save()
                break

              case '23/2':
                row.aula2 = 'P'
                const save = await row.save()
                console.log(save)
                break

              default:
                break
            }

            return row.name

            // row.aula1 = 'P'
            // row.save()
            // return row.name
          }
        })

        return res.status(200).json({ message: teste[0].name })
      })
    }
  } catch (error) {
    console.error(error)
    throw new Error(error as string)
  }
}
