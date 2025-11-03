'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { TEscolaProfeta } from '@/domain/models/escolaProfeta'
import { useHttpGet } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { useRouter } from 'next/router'

const ModuleView = () => {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const churchid = session?.user.churchId as string

  const { data: courseData, isLoading } = useHttpGet<TEscolaProfeta>(
    `/api/protected/churches/${churchid}/escola-profeta/${id}`
  )
  const course = courseData?.data

  const aprovados = useMemo(
    () => course?.alunos.filter((a) => a.status.toLowerCase() === 'aprovado').length ?? 0,
    [course]
  )

  const reprovados = useMemo(
    () => course?.alunos.filter((a) => a.status.toLowerCase() === 'reprovado').length ?? 0,
    [course]
  )

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        carregando...
      </div>
    )
  }

  if (!course) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <Card>
          <CardHeader>
            <CardTitle>Módulo não encontrado</CardTitle>
            <CardDescription>
              O módulo que você está procurando não existe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href='/'>Voltar para listagem</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b bg-card'>
        <div className='container mx-auto px-4 py-6'>
          <Button
            asChild
            variant='ghost'
            className='mb-4 cursor-pointer'
            onClick={() => router.back()}
          >
            <div className='flex'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Voltar
            </div>
          </Button>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-foreground mb-2'>
                {course.tema}
              </h1>
              <div className='flex items-center gap-4 text-muted-foreground'>
                <div className='flex items-center'>
                  <Calendar className='mr-2 h-4 w-4' />
                  Início: {new Date(course.data).toLocaleDateString(
                    'pt-BR'
                  )} - {course.numeroAulas} dias de aula
                </div>
                <Badge
                  variant={
                    course.tipoCurso === 'ESCOLA DE PROFETA'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {course.tipoCurso}
                </Badge>
              </div>
            </div>
            <Button asChild>
              <Link href={`/module/${course._id}/edit`}>Editar Módulo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='grid gap-6 md:grid-cols-3 mb-8'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Total de Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center'>
                <BookOpen className='h-8 w-8 text-primary mr-3' />
                <span className='text-3xl font-bold'>
                  {course.alunos.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Aprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center'>
                <CheckCircle2 className='h-8 w-8 text-success mr-3' />
                <span className='text-3xl font-bold text-success'>
                  {aprovados}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Reprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center'>
                <XCircle className='h-8 w-8 text-destructive mr-3' />
                <span className='text-3xl font-bold text-destructive'>
                  {reprovados}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Chamada</CardTitle>
            <CardDescription>
              Visualize a presença de cada aluno por dia de aula e seu status
              final
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='min-w-[150px] sticky left-0 bg-card z-10'>
                      Nome
                    </TableHead>
                    {course.diasAula &&
                      course.diasAula.map((dia, index) => (
                        <TableHead
                          key={dia}
                          className='text-center min-w-[100px]'
                        >
                          Aula {index + 1}
                          <div className='text-xs text-muted-foreground font-normal'>
                            {(() => {
                              const [diaStr, mesStr, anoStr] = dia.split('/')
                              const parsedDate = new Date(
                                Number(anoStr),
                                Number(mesStr) - 1, // mês em JS começa do 0
                                Number(diaStr)
                              )

                              return parsedDate.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit'
                              })
                            })()}
                          </div>
                        </TableHead>
                      ))}
                    <TableHead className='text-center min-w-[120px]'>
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.alunos
                    ?.slice() // faz uma cópia para não mutar o original
                    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
                    .map((aluno) => {
                      const presencasCount = Object.values(
                        aluno.presencas
                      ).filter((p) => p === true).length

                      const totalAulas =
                        (course.diasAula && course.diasAula.length) || 1

                      const percentualPresenca = (
                        (presencasCount / totalAulas) *
                        100
                      ).toFixed(0)

                      return (
                        <TableRow key={aluno._id}>
                          <TableCell className='font-medium sticky left-0 bg-card z-10'>
                            {aluno.nome}
                            <div className='text-xs text-muted-foreground'>
                              {presencasCount}/{totalAulas} (
                              {percentualPresenca}%)
                            </div>
                          </TableCell>
                          {course.diasAula &&
                            course.diasAula.map((dia: string, index) => (
                              <TableCell key={dia} className='text-center'>
                                <Badge
                                  variant={
                                    aluno.presencas[index] === true
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className='w-12'
                                >
                                  {aluno.presencas[index] === true ? 'P' : '-'}
                                </Badge>
                              </TableCell>
                            ))}
                          <TableCell className='text-center'>
                            <Badge
                              variant={
                                aluno.status.toLowerCase() === 'aprovado'
                                  ? 'outline'
                                  : 'destructive'
                              }
                              className={
                                aluno.status.toLowerCase() === 'aprovado'
                                  ? 'bg-green-500 hover:bg-success/90'
                                  : ''
                              }
                            >
                              {aluno.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default ModuleView
