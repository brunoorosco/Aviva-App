'use client'

import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useHttpPatch, useHttpPost } from '@/hooks/api'
import Toast from '@/components/Toast'
import { Masks } from '@/utils/masks'
import { SelectProfile } from '@/components/Select/SelectProfile'
import { Loader2, Check, X } from 'lucide-react'
import { SelectCem } from '../Select/SelectCem'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { roles } from '@/utils/constants/roles'
import { Checkbox } from '@/components/ui/checkbox'
import { useSession } from 'next-auth/react'

type FormValues = {
  name: string
  email?: string
  phone: string
  street?: string
  cemId?: string
  birth: string
  role?: string
  encontroComDeus?: boolean
  reencontroComDeus?: boolean
  sejaLivre?: boolean
  batizado?: boolean
  discipulado?: boolean
  cae?: boolean
  escolaProfeta?: boolean
}

type Props = {
  member?: any // agora opcional
  onClose: () => void
  onUpdated: () => void
}

const MemberModal = ({ member, onClose, onUpdated }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [initialData, setInitialData] = useState<FormValues | null>(null)
  const isEdit = !!member // se tem member, é edição
  const { data: session } = useSession()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birth: '',
      street: '',
      cemId: '',
      role: '',
      encontroComDeus: false,
      reencontroComDeus: false,
      sejaLivre: false,
      batizado: false,
      discipulado: false,
      cae: false,
      escolaProfeta: false
    }
  })

  // 🔹 Preenche dados se for edição
  useEffect(() => {
    if (!isEdit) return

    const normalizedRole = member.role?.toLowerCase() || ''
    const matchingRole =
      roles.find((r) => r.toLowerCase() === normalizedRole) || ''

    const cemValue =
      member.cem?._id && member.cem?.name
        ? `${member.cem._id}-${member.cem.name}`
        : ''

    const init: FormValues = {
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      birth: member.birthDate?.split('T')[0] || '',
      street: member.street || '',
      cemId: cemValue,
      role: matchingRole,
      encontroComDeus: member.encontroComDeus ?? false,
      reencontroComDeus: member.reencontroComDeus ?? false,
      sejaLivre: member.sejaLivre ?? false,
      batizado: member.batizado ?? false,
      discipulado: member.discipulado ?? false,
      cae: member.cae ?? false,
      escolaProfeta: member.escolaProfeta ?? false
    }

    setInitialData(init)
    Object.entries(init).forEach(([key, value]) =>
      setValue(key as keyof FormValues, value)
    )
  }, [isEdit, member, setValue])

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true)
    try {
      let response

      if (isEdit) {
        // PATCH → apenas campos alterados
        const changes: Partial<
          FormValues & { cem: { _id: string; name: string } }
        > = {}

        Object.entries(data).forEach(([key, value]) => {
          if (value !== (initialData as any)?.[key]) {
            //@ts-ignore
            changes[key as keyof FormValues] = value
          }
        })

        if (changes.cemId) {
          changes.cem = {
            _id: changes.cemId.split('-')[0],
            name: changes.cemId.split('-')[1]
          }
          delete changes.cemId
        }

        response = await useHttpPatch({
          url: `/api/protected/churches/${member.churchId}/users/${member._id}`,
          data: changes
        })
      } else {
        // POST → cria novo usuário
        let payload: any = { ...data }

        if (payload.cemId) {
          payload.cem = {
            _id: payload.cemId.split('-')[0],
            name: payload.cemId.split('-')[1]
          }
          delete payload.cemId
        }

        response = await useHttpPost({
          url: `/api/protected/churches/${member?.churchId || ''}/users`,
          data: payload
        })
      }

      setIsLoading(false)
      await onUpdated()

      if (response?.error) {
        Toast.showError(isEdit ? 'Erro ao atualizar!' : 'Erro ao criar!')
        return
      }

      Toast.showSuccess(
        isEdit ? 'Atualizado com sucesso!' : 'Criado com sucesso!'
      )
      onClose()
    } catch (err) {
      setIsLoading(false)
      console.error(err)
      Toast.showError(isEdit ? 'Erro ao atualizar!' : 'Erro ao criar!')
    }
  })

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-900 p-6 rounded-md w-full max-w-2xl shadow-lg'>
        <h2 className='text-xl font-bold mb-6 text-center text-gray-700 dark:text-white'>
          {isEdit ? 'Editar Membro' : 'Criar Membro'}
        </h2>

        <form onSubmit={onSubmit} className='flex flex-col gap-4'>
          {/* Nome e Email */}
          <div className='flex flex-col md:flex-row gap-4'>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className='flex flex-col flex-1'>
                  <Label>Nome</Label>
                  <Input
                    {...field}
                    placeholder='Nome Completo'
                    className='uppercase'
                    onChange={(e) =>
                      field.onChange(Masks.inputName(e.target.value))
                    }
                  />
                  {errors.name && (
                    <p className='text-sm text-red-400'>Obrigatório</p>
                  )}
                </div>
              )}
            />
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <div className='flex flex-col flex-1'>
                  <Label>Email</Label>
                  <Input {...field} placeholder='Email' className='lowercase' />
                </div>
              )}
            />
          </div>

          {/* Phone e Birth */}
          <div className='flex flex-col md:flex-row gap-4'>
            <Controller
              name='phone'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className='flex flex-col flex-1'>
                  <Label>WhatsApp</Label>
                  <Input
                    {...field}
                    placeholder='WhatsApp'
                    onChange={(e) =>
                      field.onChange(Masks.phone(e.target.value))
                    }
                  />
                  {errors.phone && (
                    <p className='text-sm text-red-400'>Obrigatório</p>
                  )}
                </div>
              )}
            />
            <Controller
              name='birth'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className='flex flex-col flex-1'>
                  <Label>Data de Nascimento</Label>
                  <Input {...field} type='date' />
                  {errors.birth && (
                    <p className='text-sm text-red-400'>Obrigatório</p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Address */}
          <Controller
            name='street'
            control={control}
            render={({ field }) => (
              <div className='flex flex-col w-full'>
                <Label>Endereço</Label>
                <Input
                  {...field}
                  placeholder='Endereço Completo'
                  className='uppercase w-full'
                />
              </div>
            )}
          />

          {/* CEM */}
          <SelectCem
            name='cemId'
            control={control}
            churchId={member?.churchId || session?.user.churchId}
            title='CEM'
            errors={{}}
          />

          {/* Role */}
          <SelectProfile
            title='Cargo Eclesiástico'
            name='role'
            control={control}
            errors={errors}
            options={roles}
          />

          {/* Checkboxes */}
          <div className='grid grid-cols-2 gap-3'>
            {[
              { name: 'encontroComDeus', label: 'Encontro com Deus' },
              { name: 'cae', label: 'C.A.E' },
              { name: 'reencontroComDeus', label: 'Reencontro com Deus' },
              { name: 'sejaLivre', label: 'Seja Livre' },
              { name: 'batizado', label: 'Batizado' },
              { name: 'discipulado', label: 'Discipulado' },
              { name: 'escolaProfeta', label: 'Escola de Profetas' }
            ].map(({ name, label }) => (
              <Controller
                key={name}
                name={name as keyof FormValues}
                control={control}
                render={({ field }) => (
                  <label className='flex items-center gap-2'>
                    <Checkbox
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                    <span>{label}</span>
                  </label>
                )}
              />
            ))}
          </div>

          {/* Botões */}
          <div className='flex flex-col sm:flex-row justify-end gap-2 mt-4'>
            <Button
              variant='outline'
              type='button'
              onClick={onClose}
              className='w-full sm:w-40'
            >
              <X className='w-4 h-4 mr-2' /> Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full sm:w-40'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Salvando...
                </>
              ) : (
                <>
                  <Check className='w-4 h-4 mr-2' /> Salvar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MemberModal
