type TAlunos = {
  _id: string
  nome: string
  status: string
}

export type TEscolaProfeta = {
  _id: string
  tema: string
  numeroAulas:number
  data: string
  tipoCourse: 'ESCOLA DE PROFETA' | 'DISCIPULADO'
  alunos: TAlunos[]
}
