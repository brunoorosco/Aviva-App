import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class BatismoMongoRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'batismos'
  }

  async getBatismoById(churchId: string, id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)

      const [batismo] = await collection
        .aggregate([
          {
            $match: { _id: new ObjectId(id) }
          },
          {
            $project: {
              data: 1,
              batizandos: {
                $sortArray: { input: '$batizandos', sortBy: { nome: 1 } }
              }
            }
          }
        ])
        .toArray()

      return batismo
    } catch (error) {
      console.error('Error finding batismo by id:', error)
      throw error
    }
  }

  async getBatismo(
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

  async addBatizando(batismoId: string, batizando: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.updateOne(
        { _id: new ObjectId(batismoId) },
        { $push: { batizandos: batizando } as any }
      )
      return result
    } catch (error) {
      console.error('Error adding batizando:', error)
      throw error
    }
  }

  async removeBatizando(
    batismoId: string,
    nome: string,
    rede: string
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.updateOne(
        { _id: new ObjectId(batismoId) },
        {
          $pull: {
            batizandos: { nome, rede }
          } as any
        }
      )
      return result
    } catch (error) {
      console.error('Error removing batizando:', error)
      throw error
    }
  }
}
