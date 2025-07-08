import { AddressModel } from './address'

export type CellsModel = {
  id: string
  name: string
} & AddressModel
