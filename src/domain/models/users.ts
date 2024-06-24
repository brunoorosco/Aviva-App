import { AddressModel } from './address'

export type UsersModel = {
  id: string
  name: string
  phone: string
  email: string
  church: string
  password: string
  permissions: string
  address: AddressModel
}
