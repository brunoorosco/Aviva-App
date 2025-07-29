import { AddressModel } from './address'

export type CellsModel = {
  _id: string
  name: string
} & AddressModel
