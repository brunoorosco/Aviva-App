import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class BatismoMongoRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'batismos'
  }

  async getBatismoById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const batismos = await collection.findOne({ _id: new ObjectId(id) })
      return batismos
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async getBatismo(
    churchId:string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: any[]
    total: number
    page: number
    totalPages: number
  }> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      collection
        .find({})
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
