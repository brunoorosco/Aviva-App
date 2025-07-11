import { AddressModel } from './address'

export type Permission ='USER' | 'ADMIN_CHURCH' | 'SUPERADMIN' | 'SECRETARIA' | 'SUPERVISOR' | 'ADMIN_CELL' 
export type Cargo ='MEMBRO' | 'DISCIPÚLO' | 'AUXILIAR' | 'LÍDER' | 'SUPERVISOR' | 'PASTOR' | 'BISPO'  

export type User = {
  _id: string
  churchId: string
  cem: Cem
  name: string
  email: string
  phone: string
  image?: string
  active: boolean
  birth: string
  address?: AddressModel
  permissions: Permission[]
  role: Cargo
  password: string
  createdAt: string
  updatedAt: string
}

type Cem = {
  _id: string
  name: string
}