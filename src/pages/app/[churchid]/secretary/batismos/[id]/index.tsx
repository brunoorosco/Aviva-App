import { Button } from '@/components/ui/button'
import { baptism } from '@/domain/models/baptism'
import { getBatismoByIdService } from '@/services/batismos'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GetServerSideProps } from 'next/types'

function formatDate(dateValue: any) {
  if (!dateValue) return ''
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
  if (!(date instanceof Date) || isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

type Props = {
  batismo: baptism | null
}

export default function batismoPage({ batismo }: Props) {
  const router = useRouter()
  if (!batismo) return <p>batismo não encontrado.</p>
  return (
    <div className='sm:p-6 max-w-4xl mx-auto'>
      <div className='flex justify-between'>
        <div>
          <h1 className='sm:text-2xl font-bold mb-2 text-xl'>
            Batismo - {formatDate(batismo.data)}
          </h1>
          <div className='grid sm:grid-cols-4 sm:col-span-2 grid-cols-2'>
            <p className='text-gray-600 text-sm mb-4'>
              Total de Encontrista:{' '}
              <label className='font-bold'>{batismo.batizandos.length}</label>
            </p>
          </div>
        </div>
        <div>
          <Button
            variant='default'
            className='flex items-center gap-2 text-gray-100 hover:text-gray-600'
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
            Voltar
          </Button>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 p-2 shadow'>
        <h2 className='text-xl font-semibold mb-2'>Batizandos</h2>

        {batismo.batizandos.length === 0 ? (
          <p className='text-sm text-gray-500'>
            Nenhum encontrista cadastrado.
          </p>
        ) : (
          <ul className='space-y-2'>
            {batismo.batizandos.map((pessoa, index) => (
              <li key={index} className='p-2'>
                <p className='text-sm font-medium'>
                  {index + 1} - {pessoa.name}
                </p>
                {pessoa.rede && (
                  <>
                    Rede:{' '}
                    <span className='font-semibold text-gray-600'>
                      {pessoa.rede}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string
  const churchid = ctx.params?.churchid as string
  const batismo = await getBatismoByIdService(churchid, id)

  if (!batismo) return { props: { batismo: null } }

  return {
    props: {
      batismo: {
        ...batismo,
        _id: batismo._id.toString(),
        data: batismo.data.toISOString(),
        encontristas: batismo.encontristas || []
      }
    }
  }
}
