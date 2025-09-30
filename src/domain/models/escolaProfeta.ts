type TAlunos = {
  _id: string
  nome: string
  status: string
  presencas: boolean[]
}

export type TEscolaProfeta = {
  _id: string
  tema: string
  numeroAulas:number
  data: string
  tipoCurso: 'ESCOLA DE PROFETA' | 'DISCIPULADO'
  alunos: TAlunos[]
  diasAula?: string[]
}
