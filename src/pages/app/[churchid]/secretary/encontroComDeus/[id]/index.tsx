import { TEncontroComDeus } from '@/domain/models/encontroComDeus'
import { useHttpGet } from '@/hooks/api'
import { getEncontroComDeusByIdService } from '@/infra/services/encontroComDeus'
import { GetServerSideProps } from 'next/types'

function formatDate(dateValue: any) {
  if (!dateValue) return ''
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
  if (!(date instanceof Date) || isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

type Props = {
  encontro: TEncontroComDeus | null
}

export default function EncontroPage({ encontro }: Props) {
  if (!encontro) return <p>Encontro não encontrado.</p>
  return (
    <div className='sm:p-6 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold mb-2'>
        Encontro nº {encontro.numero} | Data {formatDate(encontro.data)}
      </h1>
      <div className='grid grid-cols-4 col-span-2'>
        <p className='text-gray-600 text-sm mb-4'>
          Igreja: <label className='font-bold'>{encontro.igreja}</label>
        </p>
        <p className='text-gray-600 text-sm mb-4'>
          Total de Encontrista:{' '}
          <label className='font-bold'>{encontro.encontristas.length}</label>
        </p>
      </div>

      <div className='bg-white dark:bg-gray-800 p-4 rounded-md shadow'>
        <h2 className='text-xl font-semibold mb-2'>Encontristas</h2>

        {encontro.encontristas.length === 0 ? (
          <p className='text-sm text-gray-500'>
            Nenhum encontrista cadastrado.
          </p>
        ) : (
          <ul className='space-y-2'>
            {encontro.encontristas.map((pessoa, index) => (
              <li
                key={index}
                className='border grid grid-cols-3 border-gray-200 dark:border-gray-700 rounded-md p-3'
              >
                <p className='text-sm font-medium'>{pessoa.nome}</p>
                <p className='text-xs text-gray-500'>Tel: {pessoa.telefone}</p>
                {pessoa.igreja && (
                  <p className='text-xs text-gray-400'>
                    {pessoa.igreja && (
                      <>
                        Igreja:{' '}
                        <span className='font-semibold text-gray-600'>
                          {pessoa.igreja}
                        </span>
                        <br />
                      </>
                    )}
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
  const encontro = await getEncontroComDeusByIdService(churchid, id)

  if (!encontro) return { props: { encontro: null } }

  return {
    props: {
      encontro: {
        ...encontro,
        _id: encontro._id.toString(),
        data: encontro.data.toISOString(),
        encontristas: encontro.encontristas || []
      }
    }
  }
}
