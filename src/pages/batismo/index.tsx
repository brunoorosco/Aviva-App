import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Data = {
  name: string
  date: string
  cem: string
}
const Batismo = () => {
  const [bat, setBat] = useState<Data[]>()

  useEffect(() => {
    axios
      .get('/api/batismo')
      .then((res) => {
        setBat(res.data)
      })
      .catch((err) => console.log(err))
  }, [])

  async function handlePrint(evt: any) {
    evt.preventDefault()
    await axios
      .post('/api/batismo/all-certificado-pdf', bat, {
        headers: {
          Accept: 'application/pdf'
        },
        responseType: 'arraybuffer'
      })
      .then((response) => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'file.pdf')
        document.body.appendChild(link)
        link.click()
      })
  }
  return (
    <div className="flex flex-col max-w-6xl mx-auto">
      <div className="justify-center">
        <p className="mt-2 mb-1 text-2xl">Batizandos</p>
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
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Nome
                </th>

                <th scope="col" className="relative px-6 py-3">
                  <button onClick={handlePrint}>Imprimir Todos</button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bat?.map((list: Data, key: number) => (
                <tr key={key}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-4">
                        <p>{key + 1}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900"> {list.name}</div>
                    <div className="text-sm text-gray-500">{list.cem}</div>
                  </td>

                  <td className="px-3 py-2 text-sm font-medium text-right whitespace-nowrap">
                    {/* <a href="http://localhost:3000/api/pdf" className="text-indigo-600 hover:text-indigo-900">Imprimir Certificado</a> */}

                    <Link
                      download={true}
                      target="_blank"
                      replace
                      href={{
                        pathname: '/api/batismo/certificado-pdf',
                        query: {
                          nome: list.name,
                          data: list.date
                        }
                      }}
                    >
                      <p>Imprimir Certificado</p>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Batismo.getInitialProps = async (ctx: any) => {
//   const res = await fetch('api/batismo')
//   const json = await res.json()
//   return {
//     json
//   }
// }

export default Batismo
