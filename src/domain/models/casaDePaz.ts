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
  rede?: { _id: string; name: string } | string
  anfitria?: string
  telefone?: string
}

export type VisitaDePaz = CasaDePaz
export type VisitaDePazModel = CasaDePazModel