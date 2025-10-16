export type TEncontroComDeus = {
  _id: string
  data: Date
  numero: string
  igreja: string
  encontristas: People[]
}

export type TReencontroComDeus = {
  _id: string
  data: Date
  numero: string
  igreja: string
  reencontristas: People[]
}

type People = {
  nome: string
  rede?: string
  idade?: string
  email?: string
  telefone?: string
  igreja?: string
  endereco?: string
  bairro?: string
  sexo?: string
  dataNascimento?: string
}

export type TPeople = People