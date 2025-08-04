export type TEncontroComDeus = {
  _id: string
  data: Date
  numero: string
  churchId: string
  encontristas: People[]
}

type People = {
  name: string
  cem?: string
  telefone: string
  igreja?: string
}
