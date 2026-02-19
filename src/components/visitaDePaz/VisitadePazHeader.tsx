import Link from 'next/link'
import { getRedeName } from '@/utils/helpersNameREde'
import { CasaDePaz, VisitaDePazModel } from '@/domain/models/casaDePaz'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Home, Plus, Download, Calendar, Users, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'

type TProps<T> = {
  total: number
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  data: T[]
  mapExport?: any
  sheetName?: string
  filename?: string
  title?: string
  icon?: React.ReactNode
  description?: string
}

type Props = {
  pathname: string
  inputFileRef: React.RefObject<HTMLInputElement>
  casasdepaz: VisitaDePazModel[]
}

const VisitadePazHeader = ({ pathname, inputFileRef, casasdepaz }: Props) => {
  const mapBaptismToExport = (m: Omit<CasaDePaz, '_id'>) => ({
    lider1: '',
    lider2: '',
    endereço: '',
    anfitria: '',
    telefone: ''
  })

  return (
    <Header<VisitaDePazModel>
      title='Visitas de Paz'
      description='Gerencie e acompanhe todas as Visitas de Paz'
      total={casasdepaz.length}
      pathname={pathname}
      inputFileRef={inputFileRef}
      data={casasdepaz}
      mapExport={mapBaptismToExport}
      sheetName='casas'
      filename='visitas_de_paz.xlsx'
      icon={<Home className='w-6 h-6' />}
    />
  )
}

export default VisitadePazHeader

const Header = <T extends VisitaDePazModel,>({
  total,
  pathname,
  inputFileRef,
  data,
  mapExport,
  sheetName = 'Export',
  filename = 'export.xlsx',
  title = 'Itens',
  icon,
  description
}: TProps<T>) => {
  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalCasas: 0,
        casasThisMonth: 0,
        totalRedes: 0,
        avgCasasPorRegistro: 0
      }
    }

    // Total de casas de paz (soma de todas as casas de cada registro)
    const totalCasas = data.reduce((sum, item) => sum + (item.casas?.length || 0), 0)

    // Casas deste mês
    const now = new Date()
    const casasThisMonth = data
      .filter(item => {
        if (!item.data_inicial) return false
        const date = new Date(item.data_inicial)
        return date.getMonth() === now.getMonth() && 
               date.getFullYear() === now.getFullYear()
      })
      .reduce((sum, item) => sum + (item.casas?.length || 0), 0)

    // Total de redes únicas
    const redesSet = new Set<string>()
    data.forEach(item => {
      item.casas?.forEach(casa => {
        const redeName = getRedeName(casa.rede)
        if (redeName) redesSet.add(redeName)
      })
    })
    const totalRedes = redesSet.size

    // Média de casas por registro
    const avgCasasPorRegistro = total > 0 ? (totalCasas / total).toFixed(1) : 0

    return {
      totalCasas,
      casasThisMonth,
      totalRedes,
      avgCasasPorRegistro
    }
  }, [data, total])

  return (
    <Card className='shadow-sm border-2 border-gray-200 dark:border-gray-700'>
      <CardContent className='p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
          {/* Seção de Título e Informações */}
          <div className='flex items-start gap-4'>
            {/* Ícone */}
            {icon && (
              <div className='hidden sm:flex p-3 bg-blue-100 dark:bg-orange-900/30 rounded-xl shrink-0'>
                <div className='text-blue-600 dark:text-orange-500'>
                  {icon}
                </div>
              </div>
            )}

            {/* Textos */}
            <div className='flex-1 min-w-0'>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2'>
                <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                  {title}
                </h2>
                <Badge 
                  variant='secondary' 
                  className='bg-blue-100 text-blue-700 dark:bg-orange-900/30 dark:text-orange-400 w-fit'
                >
                  {total} {total === 1 ? 'período' : 'períodos'}
                </Badge>
              </div>
              
              {description && (
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  {description}
                </p>
              )}

              {/* Informação destacada: Total de Casas */}
              {stats.totalCasas > 0 && (
                <div className='flex items-baseline gap-2 mt-3'>
                  <span className='text-3xl font-bold text-blue-600 dark:text-orange-400'>
                    {stats.totalCasas}
                  </span>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {stats.totalCasas === 1 ? 'Casa de Paz realizada' : 'Casas de Paz realizadas'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Seção de Ações */}
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0'>
            {/* Botão de Exportar (se houver dados) */}
            {data && data.length > 0 && mapExport && (
              <Button
                variant='outline'
                size='default'
                className='border-2 hover:bg-muted hover:text-foreground w-full sm:w-auto'
                onClick={() => {
                  // Aqui você pode adicionar a lógica de exportação
                  console.log('Exportar dados')
                }}
              >
                <Download className='mr-2 h-4 w-4' />
                <span className='hidden sm:inline'>Exportar</span>
                <span className='sm:hidden'>Exportar Excel</span>
              </Button>
            )}

            {/* Botão Novo */}
            <Link href={`${pathname}/new`} className='w-full sm:w-auto'>
              <Button 
                className='text-white w-full h-full bg-blue-500 hover:bg-blue-600  font-semibold dark:bg-orange-500 dark:hover:bg-orange-600' 
                size='default'
              >
                <Plus className='mr-2 h-4 w-4' />
                <span className='hidden sm:inline'>Novo Período</span>
                <span className='sm:hidden'>Novo</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Estatísticas Detalhadas */}
        {total > 0 && (
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
            {/* Total de Períodos */}
            <div className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl'>
              <div className='flex items-center gap-2 mb-2'>
                <Calendar className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                <p className='text-xs text-blue-700 dark:text-blue-300 font-medium'>
                  Períodos
                </p>
              </div>
              <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                {total}
              </p>
            </div>
            
            {/* Casas deste Mês */}
            <div className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl'>
              <div className='flex items-center gap-2 mb-2'>
                <TrendingUp className='w-4 h-4 text-green-600 dark:text-green-400' />
                <p className='text-xs text-green-700 dark:text-green-300 font-medium'>
                  Este Mês
                </p>
              </div>
              <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                {stats.casasThisMonth}
              </p>
            </div>

            {/* Média por Período */}
            <div className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl'>
              <div className='flex items-center gap-2 mb-2'>
                <TrendingUp className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                <p className='text-xs text-purple-700 dark:text-purple-300 font-medium'>
                  Média/Período
                </p>
              </div>
              <p className='text-2xl font-bold text-purple-900 dark:text-purple-100'>
                {stats.avgCasasPorRegistro}
              </p>
            </div>

            {/* Total de Redes */}
            <div className='bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl'>
              <div className='flex items-center gap-2 mb-2'>
                <Users className='w-4 h-4 text-orange-600 dark:text-orange-400' />
                <p className='text-xs text-orange-700 dark:text-orange-300 font-medium'>
                  Redes Ativas
                </p>
              </div>
              <p className='text-2xl font-bold text-orange-900 dark:text-orange-100'>
                {stats.totalRedes}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}