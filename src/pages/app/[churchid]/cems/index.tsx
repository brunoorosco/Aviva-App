'use client'

import Link from 'next/link'
import Toast from '@/components/Toast'
import ButtonNew from '@/components/ButtonSubmit/buttonAdd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CellsModel } from '@/domain/models/cells'
import { useHttpGet } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Suspense } from 'react'

const Cem = () => {
  const router = useRouter()
  const churchId = router.query?.churchid
  const { data: session } = useSession()
  const { data: cems, mutate } = useHttpGet<CellsModel[]>(
    `/api/protected/churches/${session?.user.churchId}/cems`
  )

  const handleDelete = async (id: string) => {
    Toast.showDelete(
      `/api/protected/churches/${session?.user.churchId}/cems/${id}`
    )
    await mutate()
  }

  const goToMembers = (cemId: string) => {
    router.push(`/app/${churchId}/cems/${cemId}/members`)
  }

  return (
    <div className='flex flex-col w-full max-w-6xl p-3 mx-auto rounded-lg dark:text-dark-primary'>
      <Suspense fallback={<p>Carregando Redes...</p>}>
        {/* Cabeçalho */}
        <div className='flex items-center justify-between px-3 py-4 bg-white rounded-lg dark:bg-dark-secondary'>
          <div>
            <p className='text-2xl font-bold'>Nossas Redes</p>
          </div>
          <Link href={`../${churchId}/cems/new`}>
            <ButtonNew />
          </Link>
        </div>

        {/* Grid de Cards */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
          {cems?.data.map((cem: CellsModel) => (
            <Card
              key={cem._id}
              className='rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer'
              onClick={() => goToMembers(cem._id)}
            >
              <CardHeader className='flex flex-col items-center'>
                <CardTitle className='-mb-2 text-lg'>{cem.name}</CardTitle>
                <span className='text-sm line-clamp-1'>{cem.description}</span>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-gray-600 mb-2 text-xl font-semibold'>
                  {cem.membersActive || 0}{' '}
                  <span className='text-base font-normal'>membros</span>{' '}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Suspense>
    </div>
  )
}

export default Cem
