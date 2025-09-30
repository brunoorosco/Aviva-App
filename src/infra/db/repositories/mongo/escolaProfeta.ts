import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class EscolaProfetaRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'course'
  }

  async getEscolaProfetaById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const encontro = await collection.findOne({
        _id: new ObjectId(id),
        tipoCurso: 'ESCOLA DE PROFETA'
      })
      return encontro
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async getEscolaProfeta(
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
        .find({ tipoCurso: 'ESCOLA DE PROFETA' })
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

  async create(data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.insertOne(data)
      return result // Retorna o usuário inserido
    } catch (error) {
      console.error('Error creating batismo:', error)
      throw error
    }
  }
}
