import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class UsersMongoRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'users'
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

  async geUserById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      //@ts-ignore
      const user = await collection.findOne({ _id: new ObjectId(id) })

      return user
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async create(user: any): Promise<any> {
    try {
      console.log('user', user)
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = collection.insertOne(user)
      return result // Retorna o usuário inserido
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async getUsersByCellId(cemId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = collection.find({}).toArray()
      return result
    } catch (error) {
      console.error('Error get users:', error)
      throw error
    }
  }
  async getUsersByChurchId(churchId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = collection.find({churchId: churchId}).toArray()
      return result
    } catch (error) {
      console.error('Error get users:', error)
      throw error
    }
  }
}
