export type CasaDePazModel = {
  _id: string
  data_inicial: string
  casas: CasaDePaz[]
  church_id: string
}

export type CasaDePaz = {
  _id: string
  lider1: string
  lider2: string
  endereco: string
  rede: string
  anfitria?: string
  telefone?: string
}

export type VisitadePaz = CasaDePaz
export type VisitadePazMOdel = CasaDePazModel