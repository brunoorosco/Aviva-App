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
        `../../api/escola-profeta/presence/${idQrcode}`
      )
      if (status === 200) {
        Modal.showSuccess(`Registrado com Sucesso  ${data.name}`)
        setIdQrcode('')
      } else {
        Modal.showSuccess(`Oooppsssss! Falha, tente novamente!`)
        setIdQrcode('')
      }
    }
  }
  return (
    <div className="bg-gray-900">
      <div className="md:w-full lg:w-1/4 mx-auto  items-center h-screen flex flex-col justify-center">
        <p className="text-white text-xl mt-15">
          Posicione seu QrCode dentro deste quadrado
        </p>
        <QrReader
          className=""
          onResult={(result: any, error: any) => {
            if (!!result && !loading) {
              setIdQrcode(result?.text)
            }
            if (!!error) {
              console.info(error)
            }
          }}
          scanDelay={2000}
          videoStyle={{
            width: '100%',
            border: 0
          }}
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
