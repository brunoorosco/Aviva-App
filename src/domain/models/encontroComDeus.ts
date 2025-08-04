export type TEncontroComDeus = {
  _id: string
  data: Date
  numero: string
  igreja: string
  encontristas: People[]
}

type People = {
  nome: string
  rede?: string
  telefone: string
  igreja?: string
}
