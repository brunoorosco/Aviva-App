import { useHttpGet } from '@/hooks/api'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { Suspense, useState } from 'react'
import { IoPrintOutline } from 'react-icons/io5'
import Pagination from '@/components/Pagination'

type Data = {
  name: string
  date: string
  cem: string
}
const Batismo = () => {
  const [bat, setBat] = useState<Data[]>()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: session } = useSession()
  const {
    data: baptism,
    error,
    isLoading,
    mutate
  } = useHttpGet<Data[]>(
    `/api/protected/churches/${session?.user.churchId}/baptism?page=${currentPage}`
  )

  async function handlePrint(evt: any) {
    evt.preventDefault()
    await axios
      .post(
        `/api/protected/churches/${String(session?.user?.churchId)}/baptism/all-certificado-pdf`,
        bat,
        {
          headers: {
            Accept: 'application/pdf'
          },
          responseType: 'arraybuffer'
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'file.pdf')
        document.body.appendChild(link)
        link.click()
      })
  }
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }
  return (
    <div className='flex flex-col content-center w-full max-w-lg p-3 mx-auto rounded-lg dark:text-dark-primary'>
      <Suspense fallback={'teste loading'}>
        <div className='flex flex-col gap-4 p-4 mb-2 bg-white rounded-lg shadow dark:bg-dark-secondary'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>Lista de Batizados</h1>
            <Link 
              href={`/app/${session?.user.churchId}/secretary/batismos`}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase hover:bg-blue-700 transition'
            >
              Gerenciar Eventos (Editar)
            </Link>
          </div>
          <p className='text-sm text-gray-500'>Total: {baptism?.data.length || 0}</p>
        </div>

        <div className='shadow-sm'>
          <ul className='w-full px-4 mx-auto bg-white shadow-lg dark:bg-dark-secondary'>
            {baptism &&
              baptism.data.map((bapt: Data, index: number) => (
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
        {baptism && (
          <Pagination
            items={baptism.headers['items']}
            currentPage={baptism.headers['page']}
            pageSize={baptism.headers['perpage']}
            onPageChange={onPageChange}
          />
        )}
      </Suspense>
    </div>
  )
}

export default Batismo
