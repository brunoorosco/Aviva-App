import { ObjectId } from 'mongodb'
import { ChurchModel } from '@/domain/models/churchs'
import { MongoHelper } from '../../mongoHelper'

export class CellsMongoRepository {
  protected collectionName: string

  constructor() {
    this.collectionName = 'churchs'
  }

  async getCells(churchId: string): Promise<any[]> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const church = await collection.findOne<ChurchModel>(
        { _id: new ObjectId(churchId) },
        { projection: { cells: 1, _id: 0 } }
      )
      if (!church) {
        throw new Error(`Church with ID ${churchId} not found`)
      }
      return church.cells || []
    } catch (error) {
      console.error('Error getting cells:', error)
      throw error
    }
  }

  async getCellsById(churchId: string, cemId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const church = await collection.findOne<ChurchModel>(
        {
          _id: new ObjectId(churchId),
          cells: { $elemMatch: { _id: new ObjectId(cemId) } }
        },
        { projection: { cells: 1, _id: 0 } }
      )
      if (!church) {
        throw new Error(`Church with ID ${churchId} not found`)
      }
      return church.cells || []
    } catch (error) {
      console.error('Error getting cells:', error)
      throw error
    }
  }

  async create(churchId: string, data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.updateOne(
        { _id: new ObjectId(churchId) },
        { $push: { cells: { _id: new ObjectId(), ...data } } }
      )
      return result
    } catch (error) {
      console.error('Error creating cell:', error)
      throw error
    }
  }

  async update(churchId: string, cellId: string, data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.updateOne(
        {
          _id: new ObjectId(churchId),
          'cells._id': new ObjectId(cellId)
        },
        {
          $set: Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              `cells.$.${key}`,
              value
            ])
          )
        }
      )
      return result
    } catch (error) {
      console.error('Error updating cell:', error)
      throw error
    }
  }

  async delete(churchId: string, cellId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.updateOne(
        { _id: new ObjectId(churchId) },
        //@ts-ignore
        { $pull: { cells: { _id: new ObjectId(cellId) } } }
      )
      return result
    } catch (error) {
      console.error('Error deleting cell:', error)
      throw error
    }
  }
}
