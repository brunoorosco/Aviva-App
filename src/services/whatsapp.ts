import {
  useMultiFileAuthState,
  makeWASocket,
  WASocket,
  DisconnectReason
} from '@whiskeysockets/baileys'

let socket: WASocket | null = null

export const connectToWhatsApp = async (): Promise<string> => {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')

  socket = makeWASocket({
    auth: state
  })

  socket.ev.on('creds.update', saveCreds)

  return new Promise((resolve, reject) => {
    socket?.ev.on('connection.update', (update) => {
      const { connection, qr, lastDisconnect } = update
      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as any)?.output?.statusCode !==
          DisconnectReason.loggedOut
        if (shouldReconnect) {
          connectToWhatsApp().then(resolve).catch(reject)
        } else {
          reject(new Error('Conexão encerrada. Reautenticação necessária.'))
        }
      } else if (qr) {
        // Converte o QR code para uma URL de imagem
        const qrImageUrl = `data:image/png;base64,${qr}`
        resolve(qr)
      } else if (connection === 'open') {
        resolve('Conectado com sucesso!')
      }
    })
  })
}

export const getWhatsAppSocket = (): WASocket => {
  if (!socket) {
    throw new Error(
      'Socket não inicializado. Chame connectToWhatsApp primeiro.'
    )
  }
  return socket
}
