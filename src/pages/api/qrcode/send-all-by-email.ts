import { NextApiRequest, NextApiResponse } from 'next'
import { qrCodeImg } from '@/utils/qr-code-generate'
import { sendEmail } from '@/utils/send-email'
import { escolaProfeta } from '@/infra/google/accessGoogle'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let usersError: string[] = []
    if (req.method === 'POST') {
      const sheet = await escolaProfeta()
      const rows = await sheet.getRows()
      const users = await rows.map(async (row) => {
        return await rows.filter(
          (row) => row.get('is_send_email') === 'F' && row.get('email')
        )
      })

      users.forEach(async (item: any, index) => {
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
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
  }
}
