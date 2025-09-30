import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class SejaLivreRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'seja_livre'
  }

  async getSejaLivreById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const encontro = await collection.findOne({ _id: new ObjectId(id) })
      return encontro
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async getSejaLivre(
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
        .sort({ data: -1 })
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

  async create(encontro: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.insertOne(encontro)
      return result // Retorna o usuário inserido
    } catch (error) {
      console.error('Error creating batismo:', error)
      throw error
    }
  }
}
