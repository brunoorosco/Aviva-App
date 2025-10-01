import Toast from '@/components/Toast'
import { Button } from '@/components/ui/button'
import { CasaDePaz, CasaDePazModel } from '@/domain/models/casaDePaz'
import { useHttpPost, useHttpPut } from '@/hooks/api'
import { getCasasdePazByIdService } from '@/services/casasdepaz'
import { ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next/types'
import { useState } from 'react'
import CasaDePazModal from '../../../../../components/casaDePaz/CasaDePazModal'

function formatDate(dateValue: any) {
  if (!dateValue) return ''
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
  if (!(date instanceof Date) || isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

type Props = {
  casasDePaz: CasaDePazModel
}

export default function EncontroPage({ casasDePaz }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [selectedCasa, setSelectedCasa] = useState<any | null>(null)
  const { data: session } = useSession()
  const handleAdd = () => {
    setSelectedCasa(null)
    setShowModal(true)
  }

  const handleEdit = (casa: any) => {
    setSelectedCasa(casa)
    setShowModal(true)
  }

  const handleSave = async (casa: CasaDePaz) => {
    const data = {
      church_id: casasDePaz.church_id,
      dataInicial: casasDePaz.data_inicial,
      visitaId: casasDePaz._id,
      casa: casa
    }
    if (selectedCasa) {
      const response = await useHttpPut<CasaDePazModel>({
        url: `/api/protected/churches/${session?.user.churchId}/casasdepaz/${casasDePaz?._id}`,
        data
      })
      Toast.showSuccess('Sucesso ao Editar')
      return
    }
    // chamada API para adicionar
    const response = await useHttpPost({
      url: `/api/protected/churches/${session?.user.churchId}/casasdepaz/${casasDePaz?._id}`,
      data
    })

    console.log('Nova casa:', casa)
    Toast.showSuccess('Sucesso ao Salvar')
    return
    // depois você pode chamar mutate() ou refresh dos dados
  }

  if (!casasDePaz) return <p>Casa de Paz não encontrada.</p>
  return (
    <div className='sm:p-6 max-w-4xl mx-auto'>
      <div className='flex justify-between'>
        <h1 className='sm:text-2xl font-bold mb-2 text-xl'>
          Casa de Paz | Data {formatDate(casasDePaz.data_inicial)}
        </h1>
        <div className='mb-3'>
          <Button
            variant='ghost'
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900'
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
            Voltar
          </Button>
        </div>
      </div>
      <div className='grid sm:grid-cols-4 sm:col-span-2 grid-cols-2'>
        <p className='text-gray-600 text-sm mb-4'>
          Igreja: <label className='font-bold'>{casasDePaz.church_id}</label>
        </p>
        <p className='text-gray-600 text-sm mb-4'>
          Total de Casas de Paz:{' '}
          <label className='font-bold'>{casasDePaz.casas.length}</label>
        </p>
      </div>

      <div className='bg-white dark:bg-gray-800 p-4 rounded-md shadow'>
        <h2 className='text-xl font-semibold mb-2'>Casas</h2>

        {casasDePaz.casas.length === 0 ? (
          <p className='text-sm text-gray-500'>
            Nenhuma Casa de Paz cadastrada.
          </p>
        ) : (
          <ul className='space-y-2'>
            {casasDePaz.casas.map((pessoa, index) => (
              <li
                key={index}
                className='border grid grid-cols-[3fr_3fr_1fr_1fr] border-gray-200 dark:border-gray-700 rounded-md p-3'
              >
                <p className='text-xs text-gray-400'>
                  Dupla:{' '}
                  <span className='text-sm text-gray-700 font-medium'>
                    {pessoa.lider1.trim()}
                    {pessoa.lider2 && ` / ${pessoa.lider2.trim()}`}
                  </span>
                </p>
                <div>
                  <p className='text-sm font-medium'>
                    {pessoa.anfitria}
                    {pessoa.telefone && (
                      <span className='text-gray-600'>
                        {' '}
                        | Tel: {pessoa.telefone}
                      </span>
                    )}
                  </p>
                </div>
                {pessoa.rede && (
                  <p className='text-xs text-gray-400'>
                    {pessoa.rede && (
                      <>
                        Rede:{' '}
                        <span className='font-semibold text-gray-600'>
                          {pessoa.rede}
                        </span>
                      </>
                    )}
                  </p>
                )}
                <div className='flex justify-end'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleEdit(pessoa)}
                  >
                    Editar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <CasaDePazModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        initialData={selectedCasa}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string
  const churchid = ctx.params?.churchid as string
  const casasDePaz = await getCasasdePazByIdService(churchid, id)

  if (!casasDePaz) return { props: { casasDePaz: null } }
  return {
    props: {
      casasDePaz: {
        ...casasDePaz,
        _id: casasDePaz._id.toString(),
        data: casasDePaz.data_inicial,
        casas:
          casasDePaz.casas?.map((casa: any) => ({
            ...casa,
            _id: casa._id.toString()
          })) || []
      }
    }
  }
}
