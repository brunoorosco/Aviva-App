// Supports ES6
import * as venom from 'venom-bot'

export default async function setup() {
  const client = await venom
    .create({
      session: 'Tmac', //name of session
      multidevice: true // for version not multidevice use false.(default: true)
    })
    .then((client: venom.Whatsapp) => start(client))
    .catch((erro) => {
      console.log(erro)
    })
}

async function start(client: venom.Whatsapp) {
  client.onMessage((message) => {
    if (message.body === 'oi' && message.isGroupMsg === false) {
      console.log(message.from)
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          console.log('Result: ', result) //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro) //return object error
        })
    }
  })
}
export async function sendMes(client: venom.Whatsapp) {
  await client
    .sendText('5511998355651@c.us', 'teste de mensagem')
    .then((result) => {
      console.log('Result: ', result) //return object success
    })
    .catch((erro) => {
      console.error('Error when sending: ', erro) //return object error
    })
}

export async function sendImage(phone: string, name: string) {
  await venom
    .create({
      session: 'Escola-de-Profeta',
      multidevice: true // for version not multidevice use false.(default: true)
    })
    .then((client: venom.Whatsapp) =>
      client
        .sendImage(
          `55${phone}@c.us`,
          'public/filename.png',
          'image-name',
          `Seu código ${name}`
        )
        .then((result) => {
          console.log('Result: ', result) //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro) //return object error
        })
    )
    .catch((erro) => {
      console.log(erro)
    })
}
