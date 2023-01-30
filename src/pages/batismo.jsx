import React, { useState } from 'react'
import Link from 'next/link'

const Batismo = (members) => {
  const [bat, setBat] = useState(members.json)

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
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bat.map((list, key) => (
                <tr key={key}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-4">
                        <p>{key + 1}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900"> {list.Nomes}</div>
                    <div className="text-sm text-gray-500">{list.CEM}</div>
                  </td>

                  <td className="px-3 py-2 text-sm font-medium text-right whitespace-nowrap">
                    {/* <a href="http://localhost:3000/api/pdf" className="text-indigo-600 hover:text-indigo-900">Imprimir Certificado</a> */}

                    <Link
                      replace
                      href={{
                        pathname: '/api/pdf/[id]',
                        query: {
                          nome: list.Nomes,
                          data: list.data
                        }
                      }}
                    >
                      <a>Imprimir Certificado</a>
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

Batismo.getInitialProps = async (ctx) => {
  const res = await fetch('http://localhost:3000/api/google')
  const json = await res.json()
  return {
    json
  }
}

export default Batismo
