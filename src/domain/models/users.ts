import { AddressModel } from './address'

export type Permission =
  | 'USER'
  | 'ADMIN_CHURCH'
  | 'SUPERADMIN'
  | 'SECRETARIA'
  | 'SUPERVISOR'
  | 'ADMIN_CELL'
export type Cargo =
  | 'MEMBRO'
  | 'DISCIPÚLO'
  | 'AUXILIAR'
  | 'LÍDER'
  | 'SUPERVISOR'
  | 'PASTOR'
  | 'BISPO'

export type User = {
  _id: string
  churchId: string
  cem: Cem
  name: string
  email: string
  phone: string
  image?: string
  active: boolean
  birthDate: string
  address?: AddressModel
  permissions: Permission[]
  role: Cargo
  password: string
  createdAt: string
  updatedAt: string
  encontroComDeus?: boolean
  reencontroComDeus?: boolean
  sejaLivre?: boolean
  batizado?: boolean
  discipulado?: boolean
  cae?: boolean
  escolaProfeta?: boolean
  historicoEscolaProfeta?: Historico[]
}

type Historico = {
  curso_id: string
  cursoName: string
  status: 'APROVADO' | 'REPROVADO'
}

type Cem = {
  _id: string
  name: string
}
