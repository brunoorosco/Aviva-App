import { CasaDePaz } from '@/domain/models/casaDePaz'
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
      const casaDePaz = await collection.findOne({ _id: new ObjectId(id) })
      return casaDePaz
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
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.insertOne(casas)
      return {
        success: true,
      }
    } catch (error) {
      console.error('Error inserting casas de paz:', error)
      throw error
    }
  }
  async addCasa(
    casaId: string,
    casa: CasaDePaz
  ): Promise<{ success: boolean }> {
    const collection = await MongoHelper.getCollection(this.collectionName)

    const filteredCasa = Object.fromEntries(
      Object.entries(casa).filter(([_, v]) => v !== undefined)
    )

    const resp = await collection.updateOne(
      { _id: new ObjectId(casaId) },
      {
        // @ts-ignore
        $push: {
          casas: { ...filteredCasa, _id: new ObjectId() }
        }
      }
    )

    return { success: resp.matchedCount > 0 }
  }

  // Edita uma casa existente dentro do documento
  async updateCasa(
    casaId: string,
    casa: Partial<CasaDePaz>
  ): Promise<{ success: boolean }> {
    const { _id, ...rest } = casa
    const collection = await MongoHelper.getCollection(this.collectionName)
    const resp = await collection.updateOne(
      { _id: new ObjectId(casaId), 'casas._id': new ObjectId(_id) },
      {
        $set: Object.fromEntries(
          Object.entries(rest).map(([key, value]) => [`casas.$.${key}`, value])
        )
      }
    )
    return { success: true }
  }
}
