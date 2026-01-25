import Toast from '@/components/Toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CasaDePaz, CasaDePazModel } from '@/domain/models/casaDePaz'
import { useHttpPost, useHttpPut } from '@/hooks/api'
import { getCasasdePazByIdService } from '@/services/casasdepaz'
import { 
  ArrowLeft, 
  Calendar, 
  Home, 
  Users, 
  MapPin, 
  Phone, 
  Plus,
  Edit,
  Network,
  Trash2
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next/types'
import { useState } from 'react'
import CasaDePazModal from '../../../../../components/casaDePaz/CasaDePazModal'
import { usePermissions } from '@/hooks/usePermissions'
import { ROLES } from '@/lib/permissions'

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
  const { hasPermission } = usePermissions()
  
  // Verificar se pode editar
  const userCemName = session?.user?.cem?.name
  const canEditGlobal = hasPermission([ROLES.ADMIN, ROLES.SECRETARIA])
  
  // Função para verificar se pode editar uma casa específica
  const canEditCasa = (casa: CasaDePaz) => {
    // Admin e secretaria podem editar qualquer casa
    if (canEditGlobal) return true
    
    // Usuários podem editar apenas casas da sua própria rede
    return casa.rede === userCemName
  }
  
  const handleAdd = () => {
    setSelectedCasa(null)
    setShowModal(true)
  }

  const handleEdit = (casa: any) => {
    setSelectedCasa(casa)
    setShowModal(true)
  }

  const handleDelete = async (casa: any) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja remover a Casa de Paz dos líderes ${casa.lider1}${casa.lider2 ? ' / ' + casa.lider2 : ''}?`
    )
    
    if (!confirmDelete) return

    try {
      const data = {
        church_id: casasDePaz.church_id,
        dataInicial: casasDePaz.data_inicial,
        visitaId: casasDePaz._id,
        casaId: casa._id // ID da casa a ser removida
      }

      await useHttpPut({
        url: `/api/protected/churches/${session?.user.churchId}/casasdepaz/${casasDePaz._id}/delete`,
        data
      })

      Toast.showSuccess('Casa de Paz removida com sucesso!')
      router.reload()
    } catch (error) {
      Toast.showError('Erro ao remover Casa de Paz!')
      console.error('Erro ao deletar:', error)
    }
  }

  const handleSave = async (casa: CasaDePaz) => {
    const data = {
      church_id: casasDePaz.church_id,
      dataInicial: casasDePaz.data_inicial,
      visitaId: casasDePaz._id,
      casa: casa
    }
    
    if (selectedCasa) {
      await useHttpPut<CasaDePazModel>({
        url: `/api/protected/churches/${session?.user.churchId}/casasdepaz/${casasDePaz?._id}`,
        data
      })
      Toast.showSuccess('Casa de Paz editada com sucesso!')
      router.reload()
      return
    }
    
    await useHttpPost({
      url: `/api/protected/churches/${session?.user.churchId}/casasdepaz/${casasDePaz?._id}`,
      data
    })

    Toast.showSuccess('Casa de Paz adicionada com sucesso!')
    router.reload()
  }

  if (!casasDePaz) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-500'>Casa de Paz não encontrada.</p>
      </div>
    )
  }

  // Calcular estatísticas
  const redesUnicas = new Set(casasDePaz.casas.map(c => c.rede).filter(Boolean))
  const totalRedes = redesUnicas.size

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl'>
        
        {/* Header com Voltar */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <div className='flex items-start gap-4'>
            <div className='hidden sm:flex p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl shrink-0'>
              <Home className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                Casa de Paz
              </h1>
              <div className='flex items-center gap-2 mt-2'>
                <Calendar className='w-4 h-4 text-gray-500' />
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {formatDate(casasDePaz.data_inicial)}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant='outline'
            className='flex items-center gap-2 w-full sm:w-auto'
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
            Voltar
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
          <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <Home className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                <p className='text-xs text-blue-700 dark:text-blue-300 font-medium'>
                  Total de Casas
                </p>
              </div>
              <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                {casasDePaz.casas.length}
              </p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200 dark:border-purple-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <Network className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                <p className='text-xs text-purple-700 dark:text-purple-300 font-medium'>
                  Redes
                </p>
              </div>
              <p className='text-2xl font-bold text-purple-900 dark:text-purple-100'>
                {totalRedes}
              </p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <Users className='w-4 h-4 text-green-600 dark:text-green-400' />
                <p className='text-xs text-green-700 dark:text-green-300 font-medium'>
                  Líderes
                </p>
              </div>
              <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                {casasDePaz.casas.filter(c => c.lider1).length}
              </p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-200 dark:border-orange-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <Calendar className='w-4 h-4 text-orange-600 dark:text-orange-400' />
                <p className='text-xs text-orange-700 dark:text-orange-300 font-medium'>
                  Data
                </p>
              </div>
              <p className='text-sm font-bold text-orange-900 dark:text-orange-100'>
                {formatDate(casasDePaz.data_inicial)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Casas */}
        <Card>
          <CardHeader>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <CardTitle className='text-xl font-semibold'>
                Casas de Paz ({casasDePaz.casas.length})
              </CardTitle>
              <Button 
                onClick={handleAdd}
                className='bg-blue-600 hover:bg-blue-700 w-full sm:w-auto'
              >
                <Plus className='mr-2 h-4 w-4' />
                Adicionar Casa
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {casasDePaz.casas.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12'>
                <div className='p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4'>
                  <Home className='w-12 h-12 text-gray-400' />
                </div>
                <p className='text-gray-500 dark:text-gray-400 text-center mb-4'>
                  Nenhuma Casa de Paz cadastrada ainda.
                </p>
                <Button onClick={handleAdd} variant='outline'>
                  <Plus className='mr-2 h-4 w-4' />
                  Adicionar primeira Casa
                </Button>
              </div>
            ) : (
              <div className='space-y-3'>
                {casasDePaz.casas.map((pessoa, index) => (
                  <Card 
                    key={index} 
                    className='border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors'
                  >
                    <CardContent className='p-4'>
                      <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                        {/* Informações Principais */}
                        <div className='flex-1 space-y-3'>
                          {/* Líderes */}
                          <div className='flex items-start gap-2'>
                            <Users className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0' />
                            <div>
                              <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                                Dupla de Líderes
                              </p>
                              <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                                {pessoa.lider1?.trim() || 'Não informado'}
                                {pessoa.lider2 && (
                                  <span className='text-gray-600 dark:text-gray-400'>
                                    {' / '}
                                    {pessoa.lider2.trim()}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Grid de Informações Secundárias */}
                          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                            {/* Anfitriã */}
                            {pessoa.anfitria && (
                              <div className='flex items-start gap-2'>
                                <Home className='w-4 h-4 text-gray-500 mt-0.5 shrink-0' />
                                <div>
                                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Anfitriã
                                  </p>
                                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                    {pessoa.anfitria}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Telefone */}
                            {pessoa.telefone && (
                              <div className='flex items-start gap-2'>
                                <Phone className='w-4 h-4 text-gray-500 mt-0.5 shrink-0' />
                                <div>
                                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Telefone
                                  </p>
                                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                    {pessoa.telefone}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Endereço */}
                            {pessoa.endereco && (
                              <div className='flex items-start gap-2'>
                                <MapPin className='w-4 h-4 text-gray-500 mt-0.5 shrink-0' />
                                <div>
                                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Endereço
                                  </p>
                                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                    {pessoa.endereco}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Badge da Rede */}
                          {pessoa.rede && (
                            <div className='flex items-center gap-2'>
                              <Badge 
                                variant='secondary'
                                className='bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              >
                                <Network className='w-3 h-3 mr-1' />
                                {pessoa.rede}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Botões de Ação */}
                        {canEditCasa(pessoa) && (
                          <div className='flex flex-col justify-end gap-2 min-w-[120px]'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEdit(pessoa)}
                              className='w-full'
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              Editar
                            </Button>
                            <Button
                              variant='destructive'
                              size='sm'
                              onClick={() => handleDelete(pessoa)}
                              className='w-full'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Remover
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        <CasaDePazModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
          initialData={selectedCasa}
        />
      </div>
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