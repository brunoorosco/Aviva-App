import { NextApiRequest, NextApiResponse } from 'next'
import { qrCodeImg } from '@/utils/qr-code-generate'
import { sendEmail } from '@/utils/send-email'

type Study = {
  name: string
  phone: string
  id: string
  email: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const user: Study = req.body
      const qrCode = await qrCodeImg(user.id)
      const response = await sendEmail({
        emailTo: user.email,
        nameFrom: user.name,
        qrCode: String(qrCode)
      })
      if (!response) {
        return res.status(400).json({ success: false })
      }
      return res.status(200).json({ success: true })
    }
  } catch (error) {
    console.log(error)
  }
}
