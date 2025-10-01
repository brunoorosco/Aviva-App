import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ArrowLeft, Plus, Trash2, Calendar } from 'lucide-react'
import { TEscolaProfeta } from '@/domain/models/escolaProfeta'
import Toast from '@/components/Toast'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useHttpGet } from '@/hooks/api'

// Se quiser tipar o aluno localmente:
type TAluno = {
  _id: string
  nome: string
  presencas: Record<string, 'P' | 'F'>
  status: 'Aprovado' | 'Reprovado'
}

const ModuleEdit = () => {
  const params = useParams() as { id?: string }
  const { id } = params
  const router = useRouter()
  const { data: session } = useSession()
  const churchId = session?.user.churchId as string

  const isNew = id === 'new' || !id
  const isEdit = !isNew

  const { data: courseData, isLoading } = useHttpGet<TEscolaProfeta>(
    `/api/protected/churches/${churchId}/escola-profeta/${id}`
  )
  const courseEdit = courseData?.data

  const emptyCourse: TEscolaProfeta = {
    _id: '',
    tema: '',
    data: new Date().toISOString().split('T')[0],
    diasAula: [],
    tipoCurso: 'ESCOLA DE PROFETA',
    alunos: [],
    numeroAulas: 0
  }

  const initialCourse = useMemo<TEscolaProfeta>(() => {
    if (isNew) return emptyCourse
    if (courseEdit) {
      return {
        _id: courseEdit._id,
        tema: courseEdit.tema,
        data: new Date(courseEdit.data).toISOString().split('T')[0], // Se quiser manter a data original, pode usar courseEdit.data
        diasAula: courseEdit.diasAula ?? [],
        tipoCurso: courseEdit.tipoCurso ?? 'ESCOLA DE PROFETA',
        alunos: courseEdit.alunos ?? [],
        numeroAulas: courseEdit.numeroAulas ?? 0
      }
    }
    return emptyCourse
  }, [isNew, courseEdit])

  const [course, setCourse] = useState<TEscolaProfeta>(initialCourse)
  const [newAlunoNome, setNewAlunoNome] = useState('')
  const [newDiaAula, setNewDiaAula] = useState('')

  useEffect(() => {
    if (courseEdit && isEdit) {
      setCourse(initialCourse)
    }
  }, [courseEdit, initialCourse, isEdit])

  // helper para notificar de forma resiliente (suporta Toast.showX ou fallback)
  const notify = (opts: {
    title?: string
    description?: string
    variant?: 'destructive' | 'default'
  }) => {
    const t = Toast as any
    if (
      t &&
      typeof t.showError === 'function' &&
      typeof t.showSuccess === 'function'
    ) {
      if (opts.variant === 'destructive') {
        t.showError(opts.description || opts.title || '')
      } else {
        t.showSuccess(opts.description || opts.title || '')
      }
      return
    }

    // se houver função global `toast` (ex: shadcn hook), tenta usar
    const globalToast = (globalThis as any).toast
    if (typeof globalToast === 'function') {
      globalToast({
        title: opts.title,
        description: opts.description,
        variant: opts.variant === 'destructive' ? 'destructive' : 'default'
      })
      return
    }

    // fallback simples
    if (opts.variant === 'destructive') {
      console.error(opts.title, opts.description)
      alert(`${opts.title || 'Erro'}\n${opts.description || ''}`)
    } else {
      console.log(opts.title, opts.description)
    }
  }

  if (isEdit && !initialCourse) {
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
            <Button onClick={() => router.back()}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAddDiaAula = () => {
    if (!newDiaAula) {
      notify({ title: 'Selecione uma data', variant: 'destructive' })
      return
    }

    if (course.diasAula && course.diasAula.includes(newDiaAula)) {
      notify({ title: 'Esta data já foi adicionada', variant: 'destructive' })
      return
    }

    // datas em formato ISO (YYYY-MM-DD) ordenam bem com sort()
    const diasOrdenados = course.diasAula
      ? [...course.diasAula, newDiaAula].sort()
      : 0

    // Atualizar presencas de todos os alunos para incluir o novo dia (padrão 'P')
    const alunosAtualizados = (course.alunos || []).map((aluno: any) => ({
      ...aluno,
      presencas: {
        ...aluno.presencas,
        [newDiaAula]: 'P' as const
      }
    }))

    setCourse({
      ...course,
      diasAula: diasOrdenados,
      alunos: alunosAtualizados
    } as TEscolaProfeta)
    setNewDiaAula('')
  }

  const handleRemoveDiaAula = (dia: string) => {
    const alunosAtualizados = (course.alunos || []).map((aluno: any) => {
      const { [dia]: _, ...presencasRestantes } = aluno.presencas || {}
      return {
        ...aluno,
        presencas: presencasRestantes
      }
    })

    setCourse({
      ...course,
      diasAula: course.diasAula.filter((d) => d !== dia),
      alunos: alunosAtualizados
    } as TEscolaProfeta)
  }

  const handleAddAluno = () => {
    if (!newAlunoNome.trim()) {
      notify({ title: 'Digite o nome do aluno', variant: 'destructive' })
      return
    }

    const presencas: Record<string, 'P' | 'F'> = {}

    ;(course.diasAula || []).forEach((dia: string) => {
      presencas[dia] = 'P'
    })

    const newAluno: TAluno = {
      _id: `a${Date.now()}`,
      nome: newAlunoNome.trim(),
      presencas,
      status: 'Aprovado'
    }

    setCourse({
      ...course,
      alunos: [...(course.alunos || []), newAluno]
    } as TEscolaProfeta)
    setNewAlunoNome('')
  }

  const handleRemoveAluno = (alunoId: string) => {
    setCourse({
      ...course,
      alunos: (course.alunos || []).filter((a) => a._id !== alunoId)
    } as TEscolaProfeta)
  }

  const handleUpdatePresenca = (
    alunoId: string,
    dia: string,
    presenca: 'P' | 'F'
  ) => {
    setCourse({
      ...course,
      alunos: (course.alunos || []).map((a: any) =>
        a._id === alunoId
          ? {
              ...a,
              presencas: {
                ...a.presencas,
                [dia]: presenca
              }
            }
          : a
      )
    } as TEscolaProfeta)
  }

  const handleUpdateStatus = (
    alunoId: string,
    status: 'Aprovado' | 'Reprovado'
  ) => {
    setCourse({
      ...course,
      alunos: (course.alunos || []).map((a: any) =>
        a._id === alunoId ? { ...a, status } : a
      )
    } as TEscolaProfeta)
  }

  const handleSave = () => {
    if (!course.tema.trim()) {
      notify({
        title: 'O tema do módulo é obrigatório',
        variant: 'destructive'
      })
      return
    }

    if ((course.diasAula || []).length === 0) {
      notify({
        title: 'Adicione pelo menos um dia de aula',
        variant: 'destructive'
      })
      return
    }

    notify({ title: `Módulo ${isNew ? 'criado' : 'atualizado'} com sucesso!` })
    setTimeout(() => {
      router.push('/')
    }, 800)
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b bg-card'>
        <div className='container mx-auto px-4 py-6'>
          <Button
            asChild
            variant='ghost'
            className='mb-4'
            onClick={() => router.back()}
          >
            <div className='flex'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Voltar
            </div>
          </Button>
          <h1 className='text-3xl font-bold text-foreground'>
            {isNew ? 'Novo Módulo' : 'Editar Módulo'}
          </h1>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Módulo</CardTitle>
              <CardDescription>
                Preencha os dados básicos do módulo
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-12'>
                <div className='space-y-2 col-span-4'>
                  <Label htmlFor='tema'>Tema do Módulo</Label>
                  <Input
                    id='tema'
                    value={course.tema}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        tema: e.target.value
                      } as TEscolaProfeta)
                    }
                    placeholder='Digite o tema'
                  />
                </div>
                <div className='space-y-2 col-span-2'>
                  <Label htmlFor='data'>Data de Início</Label>
                  <Input
                    id='data'
                    type='date'
                    value={course.data as any}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        data: e.target.value
                      } as TEscolaProfeta)
                    }
                  />
                </div>

                <div className='space-y-2 col-span-4'>
                  <Label htmlFor='tipoCurso'>Tipo de Curso</Label>
                  <Select
                    value={(course.tipoCurso as string) || 'ESCOLA DE PROFETA'}
                    onValueChange={(
                      value: 'ESCOLA DE PROFETA' | 'DISCIPULADO'
                    ) =>
                      setCourse({
                        ...course,
                        tipoCurso: value
                      } as TEscolaProfeta)
                    }
                  >
                    <SelectTrigger id='tipoCurso'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='ESCOLA DE PROFETA'>
                        Escola de Profeta
                      </SelectItem>
                      <SelectItem value='DISCIPULADO'>Discipulado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dias de Aula</CardTitle>
              <CardDescription>
                Adicione as datas dos dias de aula
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col md:flex-row gap-2 w-full md:w-1/3'>
                <Input
                  type='date'
                  value={newDiaAula}
                  onChange={(e) => setNewDiaAula(e.target.value)}
                  className='w-full md:w-3/4'
                />
                <Button
                  type='button'
                  onClick={handleAddDiaAula}
                  className='w-full md:w-1/4'
                >
                  <Plus className='h-4 w-4 mr-2' /> Adicionar
                </Button>
              </div>

              {(course.diasAula || []).length > 0 ? (
                <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-3'>
                  {course.diasAula.map((dia, index) => (
                    <div
                      key={dia}
                      className='flex items-center justify-between p-3 border rounded-lg'
                    >
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                        <div>
                          <div className='text-sm font-medium'>
                            Aula {index + 1}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {/* {new Date(dia).toLocaleDateString('pt-BR')} */}
                            {dia}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleRemoveDiaAula(dia)}
                      >
                        <Trash2 className='h-4 w-4 text-destructive' />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-center text-muted-foreground py-4'>
                  Nenhum dia de aula adicionado
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alunos e Chamada</CardTitle>
              <CardDescription>
                Adicione alunos e gerencie a presença por dia de aula
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col md:flex-row gap-2 w-full md:w-1/3'>
                <Input
                  placeholder='Nome do aluno'
                  value={newAlunoNome}
                  onChange={(e) => setNewAlunoNome(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAluno()}
                  className='w-full md:w-3/4'
                />
                <Button onClick={handleAddAluno} className='w-full md:w-1/4'>
                  <Plus className='h-4 w-4 mr-2' /> Adicionar
                </Button>
              </div>

              {(course.alunos || []).length > 0 &&
              (course.diasAula || []).length > 0 ? (
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='min-w-[150px] sticky left-0 bg-card z-10'>
                          Nome
                        </TableHead>
                        {course.diasAula.map((dia, index) => (
                          <TableHead
                            key={dia}
                            className='text-center min-w-[100px]'
                          >
                            Aula {index + 1}
                            <div className='text-xs text-muted-foreground font-normal'>
                              {new Date(dia).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className='text-center min-w-[120px]'>
                          Status
                        </TableHead>
                        <TableHead className='text-center w-20'>
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(course.alunos || [])
                        ?.slice() // faz uma cópia para não mutar o original
                        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
                        .map((aluno: any) => (
                          <TableRow key={aluno._id}>
                            <TableCell className='font-medium sticky left-0 bg-card z-10'>
                              {aluno.nome}
                            </TableCell>
                            {course.diasAula.map((dia) => (
                              <TableCell key={dia} className='text-center'>
                                <Select
                                  value={aluno.presencas?.[dia] || 'P'}
                                  onValueChange={(value: 'P' | 'F') =>
                                    handleUpdatePresenca(aluno._id, dia, value)
                                  }
                                >
                                  <SelectTrigger className='w-20 mx-auto'>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='P'>P</SelectItem>
                                    <SelectItem value='F'>F</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            ))}
                            <TableCell className='text-center'>
                              <Select
                                value={aluno.status || 'Aprovado'}
                                onValueChange={(
                                  value: 'Aprovado' | 'Reprovado'
                                ) => handleUpdateStatus(aluno._id, value)}
                              >
                                <SelectTrigger className='w-32 mx-auto'>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='Aprovado'>
                                    Aprovado
                                  </SelectItem>
                                  <SelectItem value='Reprovado'>
                                    Reprovado
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className='text-center'>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleRemoveAluno(aluno._id)}
                              >
                                <Trash2 className='h-4 w-4 text-destructive' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className='text-center text-muted-foreground py-8'>
                  {(course.diasAula || []).length === 0
                    ? 'Adicione dias de aula primeiro'
                    : 'Nenhum aluno adicionado ainda'}
                </p>
              )}
            </CardContent>
          </Card>

          <div className='flex justify-end gap-2'>
            <Button variant='outline' asChild>
              <Link href='/'>Cancelar</Link>
            </Button>
            <Button onClick={handleSave}>Salvar Módulo</Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ModuleEdit
