import nodemailer from 'nodemailer'
import { html } from './html-email'

type Email = {
  emailTo: string
}
export const sendEmail = async (email: Email) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: 'brunoorosco',
      pass: process.env.EMAIL_PASSWORD
    },
    secure: true
  })

  const mailData = {
    from: 'brunoorosco@gmail.com',
    to: email.emailTo,
    subject: `Escola de Profeta - Avivamento`,
    text: 'Fulano, este é o código para identificação para o curso escola de profeta',
    html: html,
    attachments: [
      {
        filename: 'filename.jpeg',
        path: 'public/filename.jpeg', // path contains the filename, do not just give path of folder where images are reciding.
        cid: 'img' // give any unique name to the image and make sure, you do not repeat the same string in given attachment array of object.
      },
      {
        filename: 'logo.png',
        path: 'public/logo.png', // path contains the filename, do not just give path of folder where images are reciding.
        cid: 'logo' // give any unique name to the image and make sure, you do not repeat the same string in given attachment array of object.
      }
    ]
  }

  await transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err)
    else console.log(info)
  })
  return 'success'
}
