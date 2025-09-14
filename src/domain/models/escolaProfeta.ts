type TAlunos = {
  _id: string
  nome: string
}

export type TEscolaProfeta = {
  _id: string
  tema: string
  data: string
  tipoCourse: 'ESCOLA DE PROFETA' | 'DISCIPULADO'
  alunos: TAlunos[]
}
