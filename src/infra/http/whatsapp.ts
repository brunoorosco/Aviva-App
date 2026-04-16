import axios from "axios"

const axiosInstanceEvo = axios.create({
    baseURL: `${process.env.EVO_APIURL}`,
    withCredentials: true,
})

axiosInstanceEvo.interceptors.request.use(
    async (config) => {
        config.headers.apikey = process.env.EVO_APIKEY
        return config
    },
    (error) => Promise.reject(console.error("Error en interceptor:", error)),
)

export const sendMessageApiWhatsapp = async (userPhone: string, message: string, signature = true) => {
    if (!userPhone || userPhone === "") return
    const msg = signature ? `*Secretaria Aviva:*\n${message}` : message
    let apenasNumeros = userPhone.replace(/\D/g, "")

    if (apenasNumeros.startsWith(`55`)) {
        return apenasNumeros
    } else {
        apenasNumeros = "55" + apenasNumeros
    }

    await axiosInstanceEvo.post(`/message/sendText/${process.env.EVO_INSTANCE}`, {
        // body: `*PsicoMais:*\nOi ${firstName}, você recebeu ${row.msgCount} nova(s) mensagem(ns) na plataforma nos últimos minutos. Acesse: https://psicomais.com/app`,
        text: msg,
        number: apenasNumeros,
    })
}

export const sendMediaApiWhatsapp = async (userPhone: string, message: string, mediaUrl: string, signature = true) => {
    if (!userPhone || userPhone === "") return
    const msg = signature ? `*Secretaria Aviva:*\n${message}` : message

    console.log(mediaUrl)
    console.log("55" + userPhone.replace(/\D/g, ""))

    await axiosInstanceEvo.post(`/message/sendMedia/${process.env.EVO_INSTANCE}`, {
        number: "55" + userPhone.replace(/\D/g, ""),
        mediatype: "image", // image, video or document
        // mimetype: "image/png",
        caption: msg,
        media: mediaUrl,
        // fileName: "Imagem.png",
    })
}

export const sendPixCodeViaWhatsapp = async (userPhone: string, pixCode: string, signature = true) => {
    if (!userPhone || userPhone === "") return
    const msg = signature
        ? `*PsicoMais:*\nCódigo PIX para pagamento:\n${pixCode}`
        : `Código PIX para pagamento:\n${pixCode}`

    const body = {
        number: `55${userPhone}`,
        text: msg, // ou “body”: msg dependendo da versão da API
        // você pode adicionar “options” se quiser: delay, presence, linkPreview etc
        options: {
            delay: 3000,
            linkPreview: true,
        },
    }

    const url = `/message/sendMedia/${process.env.EVO_INSTANCE}`

    const result = await axiosInstanceEvo.post(url, body)

    return result.data
}
