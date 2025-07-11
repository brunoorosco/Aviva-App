import ButtonSubmit from '@/components/ButtonSubmit'
import { SelectCem } from '@/components/Select/SelectCem'
import { SelectChurch } from '@/components/Select/SelectChurch'
import Toast from '@/components/Toast'
import { useHttpPatch } from '@/hooks/api'
import { getSession, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

type FormValues = {
  church: string
  cem: string
}
const UserUpdatedChurchApp = () => {
  const { control, handleSubmit } = useForm<FormValues>()
  const church = useWatch({
    control,
    name: 'church'
  })
  const router = useRouter()
  const { data: session, update } = useSession()
  const teste = getSession()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setError('')
      const response = await useHttpPatch({
        url: `/api/protected/churches/${data.church}/users/${session?.user.id}`,
        data
      })
      if (response) {
        Toast.showSuccess('Atualizado com Sucesso!')
        update()
      }

      if (response?.error) {
        Toast.showError('Erro ao Atualizar!')
        setError('')
        return
      }
      setIsLoading(false)
      signOut({ callbackUrl: 'http://localhost:3000' })
    } catch (error) {
      setIsLoading(false)
      console.log('[LOGIN_ERROR]: ', error)
    }
  })

  return (
    <div className='flex w-full'>
      <div className='grid grid-cols-2 gap-4 m-4 md:grid-cols-2 lg:grid-cols-3'>
        <form
          className='px-1 mt-5 text-black max-md:w-full'
          onSubmit={onSubmit}
        >
          <div className='md:flex'>
            <div className='w-full mb-3 md:w-2/3 md:mb-0'>
              <Suspense fallback={'...carregando'}>
                <SelectChurch
                  control={control}
                  errors={false}
                  title={'Selecione sua Igreja'}
                  name='church'
                  onChange={() => {
                    console.log('teste')
                  }}
                />
              </Suspense>
            </div>
          </div>
          <div className='md:flex'>
            <div className='w-full mb-3 md:w-2/3 md:mb-0'>
              {church && (
                <Suspense fallback={'...carregando'}>
                  <SelectCem
                    control={control}
                    errors={false}
                    title={'Selecione sua Rede'}
                    name='cem'
                    churchId={church}
                  />
                </Suspense>
              )}
            </div>
          </div>
          <div className='flex'>
            <div className='w-full mb-6 md:w-full md:mb-0'>
              <ButtonSubmit text='Salvar' type='submit' />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserUpdatedChurchApp
