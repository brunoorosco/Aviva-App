import QrCode from 'qrcode'

export const generateQR = async (text: string) => {
  return await QrCode.toString(text)
}

export const qrCodeImg = async (text: string) => {
  try {
    return await QrCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#000',
        light: '#fff'
      }
    })

    // await QrCode.toFile(`./public/filename.jpeg`, text, {
    //   errorCorrectionLevel: 'H',
    //   margin: 1,
    //   color: {
    //     dark: '#000',
    //     light: '#fff'
    //   }
    // })
  } catch (error) {
    console.log(error)
  }
}
