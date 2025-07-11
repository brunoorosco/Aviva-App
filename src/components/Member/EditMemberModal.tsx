import TextInput from '@/components/Input'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useHttpGet, useHttpPatch } from '@/hooks/api' // sua função genérica aqui
import { useSession } from 'next-auth/react'
import Toast from '@/components/Toast'
import { Masks } from '@/utils/masks'
import { SelectProfile } from '@/components/Select/SelectProfile'
import { Loader2, Check, X } from 'lucide-react'
import { SelectCem } from '../Select/SelectCem'
import { mutate } from 'swr'
import { roles } from '@/utils/constants/roles'

type FormValues = {
  name: string
  email?: string
  phone: string
  zipcode?: string
  address?: string
  number?: string
  city?: string
  cemId?: string
  birth: string
  role?: string
}

type Props = {
  member: any
  onClose: () => void
   onUpdated: () => void
}

const EditMemberModal = ({ member, onClose,  onUpdated }: Props) => {
  const { data: session } = useSession()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [initialData, setInitialData] = useState<FormValues | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormValues>()

  useEffect(() => {
    if (member) {
      const normalizedRole = member.role ? member.role.toLowerCase() : ''
      const matchingRole =
        roles.find((r) => r.toLowerCase() === normalizedRole) || ''

      const cemValue =
        member.cem?._id && member.cem?.name
          ? `${member.cem._id}-${member.cem.name}`
          : ''

      const init = {
        name: member.name,
        email: member.email || '',
        phone: member.phone || '',
        birth: member.birthDate?.split('T')[0] || '',
        address: member.address || '',
        cemId: cemValue,
        role: matchingRole
      }

      setInitialData(init)

      Object.entries(init).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value)
      })
    }
  }, [member, setValue])

  const onSubmit = handleSubmit(async (data) => {
    if (!initialData) return

    // Compara os dados atuais com os iniciais e monta o objeto só com as mudanças
    const changes: Partial<
      FormValues & { cem: { _id: string; name: string } }
    > = {}
    Object.entries(data).forEach(([key, value]) => {
      if (value !== (initialData as any)[key]) {
        changes[key as keyof FormValues] = value
      }
    })

    if (Object.keys(changes).length === 0) {
      // Nenhuma alteração feita, talvez avisar o usuário
      Toast.showError('Nenhuma alteração para salvar.')
      return
    }

    // Caso tenha alteração, envie só as mudanças
    setIsLoading(true)
    try {
      // Exemplo: você ainda pode querer incluir cem completo
      if (changes.cemId) {
        changes.cem = {
          _id: changes.cemId.split('-')[0],
          name: changes.cemId.split('-')[1]
        } // Adiciona o nome do cem
        delete changes.cemId // Remove o cemId simples pois vai enviar o objeto cem
      }

      const response = await useHttpPatch({
        url: `/api/protected/churches/${member.churchId}/users/${member._id}`,
        data: changes
      })

      setIsLoading(false)
      await onUpdated()

      if (response?.error) {
        Toast.showError('Erro ao atualizar!')
        return
      }
      Toast.showSuccess('Atualizado com sucesso!')
      onClose()
    } catch (error) {
      setIsLoading(false)
      console.error(error)
      Toast.showError('Erro ao atualizar!')
    }
  })

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-900 p-6 rounded-md w-full max-w-2xl shadow-lg'>
        <h2 className='text-xl font-bold mb-4 text-center text-gray-700 dark:text-white'>
          Editar Membro
        </h2>

        <form onSubmit={onSubmit} className='flex flex-col gap-4'>
          <TextInput
            {...register('name', { required: true })}
            name='name'
            className='uppercase'
            placeholder='Nome Completo'
            control={control}
            mask={(e: string) => Masks.inputName(e)}
            error={errors.name ? 'Preenchimento Obrigatório' : ''}
          />

          <TextInput
            {...register('email')}
            name='email'
            className='lowercase'
            placeholder='Email'
            control={control}
          />

          <div className='flex flex-col md:flex-row gap-4'>
            <TextInput
              {...register('phone', { required: true })}
              name='phone'
              placeholder='WhatsApp'
              mask={(e: string) => Masks.phone(e)}
              className='uppercase w-full'
              control={control}
              error={errors.phone ? 'Preenchimento Obrigatório' : ''}
            />

            <TextInput
              {...register('birth')}
              name='birth'
              type='date'
              placeholder='Data de Nascimento'
              className='uppercase w-full'
              control={control}
              error={errors.birth ? 'Preenchimento Obrigatório' : ''}
            />
          </div>

          <div className='md:flex-row gap-4'>
            <TextInput
              name='address'
              placeholder='Endereço Completo'
              className='uppercase w-full'
              control={control}
            />
          </div>

          <SelectCem
            name='cemId'
            control={control}
            churchId={member.churchId}
            title='CEM'
            errors={{}}
          />

          <SelectProfile
            title='Cargo Eclesiástico'
            name='role'
            control={control}
            errors={errors}
            options={roles}
          />

          <div className='flex flex-col sm:flex-row justify-end gap-2 mt-4'>
            <Button
              variant='outline'
              type='button'
              onClick={onClose}
              className='w-full sm:w-40'
            >
              <X className='w-4 h-4 mr-2' />
              Cancelar
            </Button>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full sm:w-40'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className='w-4 h-4 mr-2' />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMemberModal
