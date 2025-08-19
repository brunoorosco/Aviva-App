import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'

export class CasasDePazRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'casas_de_paz'
  }

  async getCasasDePazById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const encontro = await collection.findOne({ _id: new ObjectId(id) })
      return encontro
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async getCasasDePaz(
    churchId: string,
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

  async createCasaDePaz(
   casas:any
  ): Promise<any> {
    try {
      console.log(casas)
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.insertOne(casas)
      return {
        success: true,
        // insertedCount: result.insertedCount,
        // insertedIds: result.insertedIds
      }
    } catch (error) {
      console.error('Error inserting casas de paz:', error)
      throw error
    }
  }
}
