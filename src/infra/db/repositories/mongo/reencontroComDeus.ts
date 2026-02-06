import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class ReencontroComDeusRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'reencontros'
  }

  async getReencontroComDeusById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const reencontro = await collection.findOne({ _id: new ObjectId(id) })
      return reencontro
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async getReencontroComDeus(
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
  async fechamentoAnual(ano: string) {
    const startOfYear = new Date(`${ano}-01-01T00:00:00.000Z`)
    const endOfYear = new Date(`${ano}-12-31T23:59:59.999Z`)
    const collection = await MongoHelper.getCollection(this.collectionName)

    const resp = await collection
      .aggregate([
        {
          $match: {
            data: { $gte: startOfYear, $lte: endOfYear }
          }
        },
        {
          $addFields: {
            numeroCorrigido: { $ifNull: ['$numero', '$numro'] },
            totalParticipantes: { $size: { $ifNull: ['$reencontristas', []] } }
          }
        },
        {
          $unwind: {
            path: '$reencontristas',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $facet: {
            resumoEncontros: [
              {
                $group: {
                  _id: '$_id',
                  numero: { $first: '$numeroCorrigido' },
                  data: { $first: '$data' },
                  totalParticipantes: { $first: '$totalParticipantes' },
                  encontristas: { $push: '$reencontristas' }
                }
              },
              { $sort: { data: 1 } }
            ],
            porRede: [
              {
                $group: {
                  _id: { $ifNull: ['$reencontristas.rede', 'Sem Rede'] },
                  total: { $sum: 1 }
                }
              },
              { $sort: { total: -1 } }
            ],
            porIgrejaOrigem: [
              {
                $group: {
                  _id: { $ifNull: ['$reencontristas.igreja', 'Não Informado'] },
                  total: { $sum: 1 }
                }
              },
              { $sort: { total: -1 } }
            ]
          }
        },
        {
          $project: {
            encontros: '$resumoEncontros',
            totaisPorRede: '$porRede',
            totaisPorIgreja: '$porIgrejaOrigem',
            totalAnual: {
              $sum: '$resumoEncontros.totalParticipantes'
            }
          }
        }
      ])
      .toArray()

    return resp
  }
}
