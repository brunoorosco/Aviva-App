import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class BatismoMongoRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'batismos'
  }

  async getBatismoById(churchId: string): Promise<any> {
    console.log('churchId', churchId)
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const church = await collection.findOne({ _id: new ObjectId(churchId) })
      console.log('church', church)
      return church
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async getBatismo(): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const church = await collection.find({}).toArray()

    return church
  }

  async create(batismo: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.insertOne(batismo)
      return result // Retorna o usuário inserido
    } catch (error) {
      console.error('Error creating batismo:', error)
      throw error
    }
  }
}
