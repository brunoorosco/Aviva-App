import Loading from '@/components/Select/loading'
import { StatusBadge } from '@/components/StatusBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useHttpGet } from '@/hooks/api'
import { formatAddress } from '@/utils/formaatAddress'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Award,
  BookOpen,
  Calendar,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Users,
  Waves
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export type TMembers = {
  _id: string
  name: string
  email: string
  birthDate?: Date
  image?: string
  profile: string
  active?: boolean
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
    data: _member,
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
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const member = _member?.data
  if (!member) return <p>Membro não encontrado.</p>

  const programs = [
    { key: 'encontroComDeus', label: 'Encontro com Deus', icon: Heart },
    { key: 'reencontroComDeus', label: 'Reencontro com Deus', icon: Heart },
    { key: 'sejaLivre', label: 'Seja Livre', icon: Shield },
    { key: 'batizado', label: 'Batizado', icon: Waves },
    { key: 'discipulado', label: 'Discipulado', icon: BookOpen },
    { key: 'cae', label: 'C.A.E', icon: Users }
  ]

  return (
    <div className='min-h-screen bg-gradient-bg p-2'>
      <div className='max-w-4xl mx-auto space-y-4'>
        {/* Header Card */}
        <Card className='shadow-soft border-0'>
          <CardContent className='py-6 px-8'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
              <div className='relative'>
                <Avatar className='w-24 h-24 shadow-card'>
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className='text-xl bg-orange-400 text-primary-foreground'>
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-soft'>
                  <User className='w-4 h-4 text-white' />
                </div>
              </div>

              <div className='flex-1 space-y-2'>
                <div>
                  <h1 className='text-3xl font-bold text-foreground'>
                    {member.name}
                  </h1>
                  <Badge variant='secondary' className='mt-2'>
                    {member.active ? "Membro Ativo" : "Membro Inativo"}
                  </Badge>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Mail className='w-4 h-4' />
                    <span>{member.email}</span>
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Phone className='w-4 h-4' />
                    <span>{member.phone}</span>
                  </div>
                  {member.birthDate && (
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Calendar className='w-4 h-4' />
                      <span>
                        {format(member.birthDate, "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR
                        })}
                      </span>
                    </div>
                  )}
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <MapPin className='w-5 h-5' />
                    <span className='text-sm'>{formatAddress(member)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs Card */}
        <Card className='shadow-soft border-0'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Award className='w-5 h-5 text-primary' />
              Trilho Ministerial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {programs.map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className='flex items-center gap-3 p-2 py-4 rounded-lg bg-secondary/50'
                >
                  <Icon className='w-5 h-5 text-blue-600' />
                  <StatusBadge
                    status={member[key as keyof TMembers] as boolean}
                    label={label}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Escola Profeta Card */}
        <Card className='shadow-soft border-0'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <GraduationCap className='w-5 h-5 text-accent' />
              Escola de Profeta
              {member.escolaProfeta && (
                <Badge className='ml-2 bg-accent text-accent-foreground'>
                  Participante
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          {/* <CardContent>
            {member.escolaProfeta ? (
              <div className='space-y-4'>
                {member.escolaProfetatModules &&
                member.escolaProfetatModules.length > 0 ? (
                  <div className='space-y-3'>
                    <h4 className='font-semibold text-foreground'>
                      Módulos Cursados
                    </h4>
                    <div className='grid gap-3'>
                      {member.escolaProfetatModules.map((module) => (
                        <div
                          key={module.id}
                          className='flex items-center justify-between p-4 bg-accent-light rounded-lg border border-accent/20'
                        >
                          <div className='space-y-1'>
                            <h5 className='font-medium text-foreground'>
                              {module.name}
                            </h5>
                            <p className='text-sm text-muted-foreground'>
                              {format(module.date, 'dd/MM/yyyy', {
                                locale: ptBR
                              })}
                            </p>
                          </div>
                          <StatusBadge
                            status={module.approved}
                            label={module.approved ? 'Aprovado' : 'Reprovado'}
                            variant='module'
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <GraduationCap className='w-12 h-12 mx-auto mb-4 opacity-50' />
                    <p>Nenhum módulo cursado ainda</p>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center py-8 text-muted-foreground'>
                <GraduationCap className='w-12 h-12 mx-auto mb-4 opacity-50' />
                <p>Não participa da Escola de Profeta</p>
              </div>
            )}
          </CardContent> */}
        </Card>
      </div>
    </div>
  )
}

export default MembersById
