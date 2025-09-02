import { useHttpPost } from '@/hooks/api'
export class WhatsAppServiceClient {
  urlApi = process.env.API_WHATSAPP as string
  constructor() {}

  async sendMessageText() {
    const message = 'teste de enviio'
    const phone = '5511940714391'
    const res = await useHttpPost({
      url: `${this.urlApi}/messages/send`,
      data: { message: message, phone },
      headers: { token: 'proepo' }
    })
    return res
  }
}
