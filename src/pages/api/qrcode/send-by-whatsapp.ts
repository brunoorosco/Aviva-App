import { NextApiRequest, NextApiResponse } from 'next'
import { qrCodeImg } from '@/utils/qr-code-generate'
import { sendImage } from '@/utils/send-whats'

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
      const img = await qrCodeImg(user.id)
      sendImage(user.phone, user.name)

      return res.status(200).json({ success: true })
    }
  } catch (error) {
    console.log(error)
  }
}
