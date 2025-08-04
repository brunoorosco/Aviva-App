import { TReencontroComDeus } from '@/domain/models/encontroComDeus'
import { getReencontroComDeusByIdService } from '@/infra/services/reencontroComDeus'
import { GetServerSideProps } from 'next/types'

function formatDate(dateValue: any) {
  if (!dateValue) return ''
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
  if (!(date instanceof Date) || isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

type Props = {
  reencontro: TReencontroComDeus | null
}

export default function ReencontroPage({ reencontro }: Props) {
  if (!reencontro) return <p>Encontro não encontrado.</p>
  return (
    <div className='sm:p-6 max-w-4xl mx-auto'>
       <h1 className='sm:text-2xl font-bold mb-2 text-xl'>
        Encontro nº {reencontro.numero} | Data {formatDate(reencontro.data)}
      </h1>
      <div className='grid sm:grid-cols-4 sm:col-span-2 grid-cols-2'>
        <p className='text-gray-600 text-sm mb-4'>
          Igreja: <label className='font-bold'>{reencontro.igreja}</label>
        </p>
        <p className='text-gray-600 text-sm mb-4'>
          Total de Reencontrista:{' '}
          <label className='font-bold'>
            {reencontro.reencontristas.length}
          </label>
        </p>
      </div>

      <div className='bg-white dark:bg-gray-800 p-4 rounded-md shadow'>
        <h2 className='text-xl font-semibold mb-2'>Encontristas</h2>

        {reencontro.reencontristas.length === 0 ? (
          <p className='text-sm text-gray-500'>
            Nenhum encontrista cadastrado.
          </p>
        ) : (
          <ul className='space-y-1'>
            {reencontro.reencontristas.map((pessoa, index) => (
              <li
                key={index}
                className='grid grid-cols-6 grid-rows-2 gap-1 border border-gray-200 dark:border-gray-700 rounded-md p-2'
              >
                {/* A: nome + idade */}
                <div className='col-span-3 row-span-2'>
                  <p className='text-sm font-medium'>
                    {pessoa.nome}
                    {pessoa.idade ? ` - ${pessoa.idade}` : ''}
                  </p>
                </div>

                {/* B: telefone */}
                <div className='col-span-1 row-start-1 col-start-4'>
                  <p className='text-xs text-gray-500'>
                    Tel: {pessoa.telefone}
                  </p>
                </div>

                {/* C: igreja */}
                 {pessoa.rede && (
                  <div className='col-span-2 row-start-2 col-start-5'>
                    <p className='text-xs text-gray-400'>
                      Rede:{' '}
                      <span className='font-semibold text-gray-600'>
                        {pessoa.rede}
                      </span>
                    </p>
                  </div>
                )}

                <div className='col-span-2 row-start-1 col-start-5'>
                  {pessoa.igreja && (
                    <p className='text-xs text-gray-400'>
                      Igreja:{' '}
                      <span className='font-semibold text-gray-600'>
                        {pessoa.igreja}
                      </span>
                    </p>
                  )}
                </div>

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
  const encontro = await getReencontroComDeusByIdService(churchid, id)

  if (!encontro) return { props: { encontro: null } }

  return {
    props: {
      reencontro: {
        ...encontro,
        _id: encontro._id.toString(),
        data: encontro.data.toISOString(),
        reencontristas: encontro.reencontristas || []
      }
    }
  }
}
