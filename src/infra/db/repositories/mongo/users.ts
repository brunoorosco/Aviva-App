import { MongoHelper } from '../../mongoHelper'
import { ParamUserLogin } from '../TUsers'

export class UsersMongoRepository {
  private collectionName: string
  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  async getByEmail(email?: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const user = await collection.findOne({ email })

      return user
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
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
