import nodemailer from 'nodemailer'
import path, { resolve } from 'path'
import { html } from './html-email'
import { promises as fs } from 'fs'

type Email = {
  emailTo: string
  nameFrom: string
}
export const sendEmail = async (dataEmail: Email) => {
  try {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
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
          console.log('Server is ready to take our messages')
          resolve(success)
        }
      })
    })
    const qrCodeDirectory = path.join(process.cwd(), '/')

    const mailData = {
      from: 'brunoorosco@gmail.com',
      to: dataEmail.emailTo,
      subject: `Escola de Profeta - Avivamento`,
      text: `${dataEmail.nameFrom}, este é o código para identificação para o curso escola de profeta`,
      html: html(dataEmail.nameFrom),
      attachments: [
        // {
        //   filename: 'filename.jpeg',
        //   path: `${qrCodeDirectory}/src/assets/images/filename.jpeg`, // path contains the filename, do not just give path of folder where images are reciding.
        //   cid: 'img' // give any unique name to the image and make sure, you do not repeat the same string in given attachment array of object.
        // },
        {
          filename: 'logo-preto.png',
          path: '/logo-preto.png', // path contains the filename, do not just give path of folder where images are reciding.
          cid: 'logo' // give any unique name to the image and make sure, you do not repeat the same string in given attachment array of object.
        }
      ]
    }

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, function (err, info) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          console.log(info)
          resolve(info)
        }
      })
      return 'success'
    })
  } catch (error) {
    console.error(error)
  }
}
