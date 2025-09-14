export type baptism = {
  _id: string
  data: Date
  churchId: string
  batizandos: People[]
}

type People = {
  nome: string
  rede?: string
  isCourse: boolean
}
