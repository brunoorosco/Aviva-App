import qr from 'qrcode'

export const generateQR = async (text: string) => {
  return await qr.toString(text)
}

export const qrCodeImg = (text: string) => {
  qr.toFile(
    'assets/qr-code/filename.jpeg',
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
