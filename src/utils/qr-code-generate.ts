import path from 'path'
import qr from 'qrcode'
import { promises as fs } from 'fs'

export const generateQR = async (text: string) => {
  return await qr.toString(text)
}

export const qrCodeImg = async (text: string) => {
  const qrCodeDirectory = path.join(process.cwd(), '/')
  qr.toFile(
    `${qrCodeDirectory}/filename.jpeg`,
    text,
    {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#000',
        light: '#fff'
      }
    },
    function (err) {
      if (err) throw err
      console.log('qr-code-complete')
    }
  )
}
