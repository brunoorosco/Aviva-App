import React, { useEffect, useState } from 'react'
import axios from 'axios'

export type Study = {
  name: string
  phone: string
  id: string
  email: string
  church?: string
}

const ListaEscolaProfeta = () => {
  const [subscribers, setSubscriber] = useState<Study[]>()

  useEffect(() => {
    axios
      .get('/api/escola-profeta/list')
      .then((res) => {
        setSubscriber(res.data)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleSendQr = async (data: any) => {
    const res = await axios.post('/api/qrcode/send', data)
  }

  return (
    <>
      <div className="flex justify-center">
        <p className="mt-2 text-2xl">Escola de Profeta</p>
      </div>
      <div className="flex mb-1 justify-center">
        <p className="text-xl">{subscribers?.length} - Inscritos</p>
      </div>
      <div className="flex mx-auto justify-center">
        <div className="overflow-x-auto flex ">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg"></div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase ">
                    Nome
                  </th>

                  <th className="relative  py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers?.map((subscriber: Study) => (
                  <tr key={subscriber.id}>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-900 truncate">
                        {subscriber.name.substring(0, 25)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscriber.email}
                      </div>

                      <div className="text-sm text-gray-900">
                        {subscriber.phone}
                      </div>
                    </td>

                    <td className="py-2 pr-3 text-sm font-medium text-center mr-2">
                      <a
                        onClick={(e) => {
                          handleSendQr(subscriber)
                        }}
                      >
                        Enviar QrCode
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListaEscolaProfeta

const list = [
  {
    id: '3c3d8455-d2e1-4319-8723-07b1b42ba64b',
    name: 'Bruno Orosco ',
    phone: '11940714391',
    email: 'brunoorosco@gmail.com',
    church: 'Sede'
  },
  {
    id: '12b22553-8579-4718-a097-8b5421fd663a',
    name: 'Jair alves Pequeno',
    phone: '11915956020',
    email: 'Jair.alvespequeno@gmail.com',
    church: 'Sede'
  },
  {
    id: 'ce02be1a-97e4-489a-8b87-272d476914dd',
    name: 'Marivaldo da Silva ',
    phone: '11970168409',
    email: 'marivaodosilva@gmail.com',
    church: 'Sede'
  },
  {
    id: '7d3ea5e7-dca3-4e68-9885-cc701ad92277',
    name: 'Simone Costa Silva ',
    phone: '11940163671',
    email: 'simonecsilva318@gmail.com',
    church: 'Sede'
  }
]
