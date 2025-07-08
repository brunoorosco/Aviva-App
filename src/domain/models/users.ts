import { AddressModel } from './address'

export type Permission ='user' | 'admin' | 'superAdmin' | 'secretary' 

export type User = {
  _id: string
  churchId: string
  cemId: string
  name: string
  email: string
  phone: string
  birth: string
  address: AddressModel
  permissions: Permission[]
  password: string
}
