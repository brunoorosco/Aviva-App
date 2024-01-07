import { useHttpGet } from '@/hooks/api'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { Suspense, useState } from 'react'
import { IoPrintOutline } from 'react-icons/io5'

type Data = {
  name: string
  date: string
  cem: string
}
const Batismo = () => {
  const [bat, setBat] = useState<Data[]>()
  const { data: session } = useSession()
  const {
    data: baptism,
    error,
    isLoading,
    mutate
  } = useHttpGet<Data[]>(
    `/api/protected/churches/${session?.user.churchId}/baptism`
  )

  async function handlePrint(evt: any) {
    evt.preventDefault()
    await axios
      .post(
        `/api/protected/churches/${session?.user.churchId}/baptism/all-certificado-pdf`,
        bat,
        {
          headers: {
            Accept: 'application/pdf'
          },
          responseType: 'arraybuffer'
        }
      )
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
    <div className='flex flex-col content-center w-full max-w-lg p-3 mx-auto rounded-lg dark:text-dark-primary'>
      <Suspense fallback={'teste loading'}>
        {/* {isLoading ? (
      <Skeleton />
    ) : (
      <> */}
        <div className='flex justify-between px-3 pt-5 mt-2 bg-white rounded-t-lg dark:bg-dark-secondary'>
          <div className=''>
            <div className='flex justify-between'>
              <p className='mr-3 text-2xl font-bold leading-5'>Batizandos</p>
              <div className='leading-5'>
                {/* <GiMeepleGroup size={24} /> */}
              </div>
            </div>
            <p className='mt-2 mb-5 text-gray-400'>{baptism?.length}</p>
          </div>
          <div onClick={handlePrint}>
            <IoPrintOutline size={25} />
          </div>
        </div>

        <div className='shadow-sm'>
          <ul className='w-full px-4 mx-auto bg-white shadow-lg dark:bg-dark-secondary'>
            {baptism &&
              baptism.map((bapt: Data, index: number) => (
                <li className='py-3 sm:pb-3' key={index}>
                  <div className='flex justify-between space-x-4 align-middle border-b border-b-gray-200 dark:border-b-gray-700'>
                    <div className='flex flex-col'>
                      <div className='flex min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate dark:text-gray-200'>
                          {bapt.name}
                        </p>
                      </div>
                      <div className='min-w-0 '>
                        <p className='text-sm text-gray-900 truncate dark:text-gray-200'>
                          {bapt.cem || ''}
                        </p>
                      </div>
                    </div>
                    <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark-primary'>
                      <Link
                        download={true}
                        target='_blank'
                        replace
                        href={{
                          pathname: `/api/protected/churches/${session?.user.churchId}/baptism/certificado-pdf`,
                          query: {
                            nome: bapt.name,
                            data: bapt.date
                          }
                        }}
                      >
                        <IoPrintOutline />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </Suspense>
      {/* </>
    )} */}
    </div>
    // <div className='flex flex-col max-w-6xl mx-auto'>
    //   <div className='justify-center'>
    //     <p className='mt-2 mb-1 text-2xl'>Batizandos</p>
    //   </div>

    //   <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
    //     <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
    //       <div className='overflow-hidden border-b border-gray-200 shadow sm:rounded-lg'></div>

    //       <table className='min-w-full divide-y divide-gray-200'>
    //         <thead className='bg-gray-50'>
    //           <tr>
    //             <th
    //               scope='col'
    //               className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
    //             >
    //               ID
    //             </th>
    //             <th
    //               scope='col'
    //               className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
    //             >
    //               Nome
    //             </th>

    //             <th scope='col' className='relative px-6 py-3'>
    //               <button onClick={handlePrint}>Imprimir Todos</button>
    //             </th>
    //           </tr>
    //         </thead>
    //         <tbody className='bg-white divide-y divide-gray-200'>
    //           {baptism?.map((list: Data, key: number) => (
    //             <tr key={key}>
    //               <td className='px-3 py-2 whitespace-nowrap'>
    //                 <div className='flex items-center'>
    //                   <div className='flex-shrink-0 w-10 h-4'>
    //                     <p>{key + 1}</p>
    //                   </div>
    //                 </div>
    //               </td>
    //               <td className='px-3 py-2 whitespace-nowrap'>
    //                 <div className='text-sm text-gray-900'> {list.name}</div>
    //                 <div className='text-sm text-gray-500'>{list.cem}</div>
    //               </td>

    //               <td className='px-3 py-2 text-sm font-medium text-right whitespace-nowrap'>
    //                 {/* <a href="http://localhost:3000/api/pdf" className="text-indigo-600 hover:text-indigo-900">Imprimir Certificado</a> */}

    //                 <Link
    //                   download={true}
    //                   target='_blank'
    //                   replace
    //                   href={{
    //                     pathname: '/api/batismo/certificado-pdf',
    //                     query: {
    //                       nome: list.name,
    //                       data: list.date
    //                     }
    //                   }}
    //                 >
    //                   <p>Imprimir Certificado</p>
    //                 </Link>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </div>
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
