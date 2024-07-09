import { MongoHelper } from '../../mongoHelper'
import { ParamUserLogin } from '../TUsers'

export class ChurChMongoRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'churchs'
  }

  async getByChurchId(churchId?: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const church = await collection.findOne({ church: churchId })

      return church
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async getChurch(): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const church = await collection.find({}).toArray()

    return church
  }

  async create(user: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.insertOne(user)
      return result // Retorna o usuário inserido
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }
}
