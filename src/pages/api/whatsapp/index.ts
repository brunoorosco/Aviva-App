import { sendImage } from '@/utils/send-whats'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    sendImage('11998355651', 'Ana Luz')
    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
  }
}
