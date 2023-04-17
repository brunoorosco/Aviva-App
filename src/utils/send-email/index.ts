import nodemailer from 'nodemailer'
import { html } from './html-email'

type Email = {
  emailTo: string
  nameFrom: string
  qrCode: string
}
export const sendEmail = async (dataEmail: Email) => {
  try {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: process.env.EMAIL_HOST,
      auth: {
        // user: process.env.EMAIL,
        // pass: process.env.EMAIL_PASSWORD
        user: 'cursos.sede@avivamentoemcristo.com.br',
        pass: 'ozivdscduuvoxkcy'
      },
      secure: true,
      service: 'gmail'
    })

    await new Promise((resolve, reject) => {
      // verify connection  configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(success)
        }
      })
    })

    const mailData = {
      from: 'brunoorosco@gmail.com',
      to: dataEmail.emailTo,
      subject: `Escola de Profeta - Avivamento`,
      text: `${dataEmail.nameFrom}, este é o código para identificação para o curso escola de profeta`,
      html: html(dataEmail.nameFrom, dataEmail.qrCode),
      attachments: [
        {
          filename: 'qrCode.png',
          path: `${dataEmail.qrCode}`, // path contains the filename, do not just give path of folder where images are reciding.
          cid: `img` // give any unique name to the image and make sure, you do not repeat the same string in given attachment array of object.
        },
        {
          filename: 'logo-preto.png',
          path: './public/logo-preto.png', // path contains the filename, do not just give path of folder where images are reciding.
          cid: 'logo' // give any unique name to the image and make sure, you do not repeat the same string in given attachment array of object.
        }
      ]
    }

    const response = await transporter.sendMail(mailData)
    if (response.accepted.length === 0) return false
    return true
  } catch (error) {
    console.error(error)
  }
}
