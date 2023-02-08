import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'

const ReadQrCode = (props: any) => {
  const [data, setData] = useState('')
  useEffect(() => {
    handleRegister()
    setData('')
  }, [data])

  async function handleRegister() {
    if (data) {
      const resp = await axios.get(`../api/escola-profeta/present/${data}`)
      if (resp.status === 200) {
        alert('ok')
      }
    }
  }
  return (
    <div className="bg-black">
      <div className="md:w-full lg:w-1/4 justify-center mx-auto items-center h-screen flex flex-col">
        <p>Leitor de Código</p>

        <QrReader
          onResult={(result: any, error: any) => {
            if (!!result) {
              setData(result?.text)
            }

            if (!!error) {
              console.info(error)
            }
          }}
          videoStyle={{ width: '100%', display: 'flex' }}
          containerStyle={{ width: '100%' }}
          constraints={{}}
        />

        <p className="text-white text-lg">{data}</p>
      </div>
    </div>
  )
}
export default ReadQrCode
