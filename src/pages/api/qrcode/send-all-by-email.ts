import { NextApiRequest, NextApiResponse } from 'next'
import { qrCodeImg } from '@/utils/qr-code-generate'
import { sendEmail } from '@/utils/send-email'
import { getDoc } from '../docGoogle'
import QrCode from 'qrcode'

type Study = {
  id: string
  name: string
  email: string
  is_email_send: boolean
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let usersError: string[] = []
    if (req.method === 'POST') {
      const listUsers = await getDoc()
        .then(async (doc) => {
          const sheet = doc.sheetsByTitle['escola-profeta-insc']
          const rows = await sheet.getRows()
          return await rows.filter(
            (row) => row.is_send_email === 'F' && row.email
          )
        })
        .then((data: any[]) => {
          data.forEach(async (item, index) => {
            const qrCode = await qrCodeImg(item.qrcode)
            const response = await sendEmail({
              emailTo: item.email,
              nameFrom: item.name,
              qrCode: String(qrCode)
            })

            if (!response) {
              usersError.push(item.name)
            } else {
              item.is_send_email = 'V'
              item.save()
            }
          })
        })

      //     return await rows.map((row) => {
      //       return {
      //         id: row.qrcode,
      //         email: row.email,
      //         is_send_email: row.is_send_email,
      //         name: row.name
      //       }
      //     })
      //   })

      //   let usersError: string[] = []
      //   listUsers.forEach(async (item, index) => {
      //     if (item.is_send_email === 'F' && item.email) {
      //       await qrCodeImg(item.id)
      //       const response = await sendEmail({
      //         emailTo: item.email,
      //         nameFrom: item.name
      //       })
      //       console.log(response)
      //       if (!response) {
      //         usersError.push(item.name)
      //       } else {
      //       }
      //       console.log(usersError)
      //     }
      //   })

      //   if (!response) {
      //     return res.status(400).json({ success: false })
      //   }
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
  }
}
