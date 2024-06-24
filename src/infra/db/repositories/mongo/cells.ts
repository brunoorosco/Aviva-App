import { MongoHelper } from '../../mongoHelper'
// import { ParamCellCreate } from '../TUsers'

export class CellsMongoRepository {
  protected collectionName: string
  constructor() {
    this.collectionName = 'churchs'
  }

  async getCells(churchId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      //@ts-ignore
      const church = collection.findOne({ _id: churchId }, { cells: 1, _id: 0 })
      if (!church) {
        throw new Error(`Church with ID ${churchId} not found`)
      }

      return church
    } catch (error) {
      console.error('Error get Churchs:', error)
      throw error
    }
  }
  async create(churchId: string, data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.updateOne(
        //@ts-ignore
        { _id: churchId },
        {
          $push: { cells: data }
        }
      )
      return result
    } catch (error) {
      console.error('Error creating cell:', error)
      throw error
    }
  }
}
