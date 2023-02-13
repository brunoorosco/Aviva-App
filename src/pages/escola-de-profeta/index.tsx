import React, { useState } from 'react'
import axios from 'axios'

type Study = {
  name: string
  phone: string
  id: string
  email: string
}

const ListaEscolaProfeta = (members: any) => {
  const [bat, setBat] = useState(members.json)
  const handleSendQr = async (data: any) => {
    const res = await axios.post('/api/qrcode/send', data)
  }

  return (
    <div className="flex flex-col max-w-6xl mx-auto">
      <div className="justify-center">
        <p className="mt-2 mb-1 text-2xl">Escola de Profeta</p>
      </div>

      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg"></div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Nome
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  WhatsApp
                </th>

                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            {/* <tbody className="bg-white divide-y divide-gray-200">
              {bat.map((list: Study) => (
                <tr key={list.id}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900"> {list.name}</div>
                    <div className="text-sm text-gray-500">{list.email}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900"> {list.phone}</div>
                  </td>

                  <td className="px-3 py-2 text-sm font-medium text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        handleSendQr(list)
                      }}
                    >
                      Enviar QrCode
                    </button>
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
    </div>
  )
}

// ListaEscolaProfeta.getInitialProps = async (ctx: any) => {
//   const res = await fetch('/api/escola-profeta/list')
//   const json = await res.json()
//   console.log(json)
//   return {
//     json
//   }
// }

export default ListaEscolaProfeta
