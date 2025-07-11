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
  async desactiveUser(userId: string, data: any): Promise<any> {
    try {
      console.log('user', userId, data)
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { active: data } }
      )
      return result
    } catch (error) {
      console.error('Error get users:', error)
      throw error
    }
  }
  async getUsersByChurchId(
    churchId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: any[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)

      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
        collection
          .find({ churchId })
          .collation({ locale: 'pt', strength: 1 })
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        collection.countDocuments({ churchId })
      ])

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('Error get users with pagination:', error)
      throw error
    }
  }
}
