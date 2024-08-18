import { NextApiRequest, NextApiResponse } from 'next'
import { connectToWhatsApp } from '../../../services/whatsapp'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const qrcode = await connectToWhatsApp()
    res.status(200).json({
      message: 'Conexão iniciada. Escaneie o QR Code no terminal.',
      qrcode
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
