import Avatar from '@/components/Avatar'
import Loading from '@/components/Select/loading'
import { Button } from '@/components/ui/button'
import { useHttpGet } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export type TMembers = {
  _id: string
  name: string
  email: string
  birth?: Date
  image?: string
  profile: string
  street?: string
  number?: string
  city?: string
  cep?: string
  state?: string
  phone: string
  cae?: boolean
  batizado?: boolean
  discipulado?: boolean
  encontroComDeus?: boolean
  reencontroComDeus?: boolean
  sejaLivre?: boolean
  escolaProfeta?: boolean
}

const MembersById = () => {
  const router = useRouter()
  const { query } = router
  const { data: session } = useSession()
  const churchId = session?.user.churchId as string
  const cemId = session?.user.cem._id as string

  const {
    data: member,
    error,
    isLoading
  } = useHttpGet<TMembers>(
    `/api/protected/churches/${churchId}/cems/${cemId}/members/${query.memberId}`
  )

  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='container'>
      {member?.data ? (
        <div className='relative w-5/6 mx-auto mt-20 bg-white rounded-lg shadow md:w-5/6 lg:w-4/6 xl:w-3/6 md:mt-24 p-4'>
          {/* Botão voltar */}
          <div className='absolute top-4 left-4'>
            <Button
              variant='outline'
              onClick={() => router.back()}
              className='rounded-2xl shadow-md'
            >
              Voltar
            </Button>
          </div>

          {/* Avatar */}
          <div className='flex justify-center'>
            <Avatar
              name={member.data.name}
              className='absolute mx-auto text-4xl transition duration-200 transform w-28 h-28 -top-20 hover:scale-110'
            />
          </div>

          <div className='mt-16'>
            {/* Nome */}
            <h1 className='text-3xl font-bold text-center text-gray-900'>
              {member.data.name}
            </h1>
            <p className='text-sm font-medium text-center text-gray-400'>
              {member.data.profile || ''}
            </p>

            {/* Contato */}
            <div className='px-6 my-5'>
              <div className='flex flex-col px-6 py-3 font-medium leading-6 text-center text-gray-200 bg-gray-900 rounded-lg'>
                <span className='font-bold'>{member.data.email}</span>
                <span className='font-bold'>{member.data.phone}</span>
                <span className='font-bold'>
                  <Address>{member.data}</Address>
                </span>
              </div>
            </div>

            {/* Informações extras */}
            <div className='px-6 my-5'>
              <h3 className='font-medium text-left text-gray-900 mb-3'>
                Informações
              </h3>
              <ul className='grid grid-cols-2 gap-3 text-sm'>
                {member.data.cae && (
                  <li className='flex items-center gap-2'>
                    ✅ <span>CAE</span>
                  </li>
                )}
                {member.data.batizado && (
                  <li className='flex items-center gap-2'>
                    ✅ <span>Batizado</span>
                  </li>
                )}
                {member.data.discipulado && (
                  <li className='flex items-center gap-2'>
                    ✅ <span>Discipulado</span>
                  </li>
                )}
                {member.data.encontroComDeus && (
                  <li className='flex items-center gap-2'>
                    ✅ <span>Encontro com Deus</span>
                  </li>
                )}
                {member.data.reencontroComDeus && (
                  <li className='flex items-center gap-2'>
                    ✅ <span>Reencontro com Deus</span>
                  </li>
                )}
                {member.data.sejaLivre && (
                  <li className='flex items-center gap-2'>
                    ✅ <span>Seja Livre</span>
                  </li>
                )}
                {member.data.escolaProfeta && (
                  <li className='flex items-center gap-2 mb-4'>
                    ✅ <span>Escola do Profeta</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <section className='h-screen p-16 mx-auto bg-gray-50 dark:bg-gray-800'></section>
      )}
    </div>
  )
}

const Address = ({ children }: any) => {
  const fullAddress = `${children?.street || ''} - ${children?.city || ''}`

  return (
    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
      {fullAddress}
    </p>
  )
}

export default MembersById
