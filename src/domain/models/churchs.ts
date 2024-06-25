import { ObjectId } from 'mongodb'
import { AddressModel } from './address'
import { CellsModel } from './cells'

export type ChurchModel = {
  _id: ObjectId
  name: string
  cells: CellsModel[]
  address: AddressModel
}
