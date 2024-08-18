import { useState } from 'react'
import { useHttpGet } from './api'

type Data = {
  message: string
  qrcode: string
}

export const useWhatsApp = () => {
  const [qrcode, setQrcode] = useState<string | null>(null)
  const { data, error, isLoading } = useHttpGet<Data>(`/api/whatsapp/connect`)

  const connect = async () => {
    setQrcode(null)
    try {
      if (!data) {
        throw new Error()
      }
      setQrcode(data.data.qrcode)
    } catch (err: any) {
      // setError(err.message)
    }
  }

  return { connect, isLoading, qrcode, error }
}
