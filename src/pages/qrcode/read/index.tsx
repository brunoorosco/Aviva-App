import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'

import Modal from '@/components/Modal'

const ReadQrCode = (props: any) => {
  const [idQrcode, setIdQrcode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    handleRegister()
    setLoading(false)
  }, [idQrcode])

  async function handleRegister() {
    if (idQrcode) {
      setLoading(true)
      const { status, data } = await axios.get(
        `../api/escola-profeta/presence/${idQrcode}`
      )

      if (status === 200) {
        Modal.showSuccess(`Registrado com Sucesso  ${data.message}`)
      } else {
        Modal.showSuccess(`Oooppsssss! Falha, tente novamente!`)
      }
      setIdQrcode('')
    }
  }
  return (
    <div className="bg-black">
      <div className="md:w-full lg:w-1/4 mx-auto justify-center items-center h-screen flex flex-col">
        <p className="text-white text-xl mt-15">
          Posicione seu QrCode dentro deste quadrado
        </p>
        <QrReader
          className="qrCode"
          onResult={(result: any, error: any) => {
            if (!!result && !loading) {
              setIdQrcode(result?.text)
            }
            if (!!error) {
              console.info(error)
            }
          }}
          scanDelay={2000}
          videoStyle={{ width: '100%' }}
          containerStyle={{ width: '100%' }}
          constraints={{}}
        />

        <div>
          <p className="text-white">{idQrcode}</p>
        </div>
      </div>
    </div>
  )
}
export default ReadQrCode
