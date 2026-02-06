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
            totalParticipantes: { $size: { $ifNull: ['$reencontristas', []] } } // Assuming field name is reencontristas or encontristas? Let's assume reencontristas based on prior file or standardized. Actually, usually Encontro uses encontristas. Let me be safe and check if I can see valid field names. For 'Seja Livre' likely 'encontristas'.
            // Checking previous files: Encontro -> encontristas. Reencontro -> reencontristas. Seja Livre -> ???
            // I'll stick to 'encontristas' as default for standard meetings, but I should verify.
            // Wait, looking at file 292 (sejaLivre.ts), it doesn't show types.
            // I will err on side of 'encontristas' as it is standard.
          }
        },
        {
          // Actually, let's use $ifNull to try both potential field names to be safe
          $addFields: {
            listaParticipantes: { $ifNull: ["$encontristas", "$reencontristas"] }
          }
        },
        {
          $addFields: {
            totalParticipantes: { $size: { $ifNull: ["$listaParticipantes", []] } }
          }
        },
        {
          $unwind: {
            path: '$listaParticipantes',
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
                  encontristas: { $push: '$listaParticipantes' }
                }
              },
              { $sort: { data: 1 } }
            ],
            porRede: [
              {
                $group: {
                  _id: { $ifNull: ['$listaParticipantes.rede', 'Sem Rede'] },
                  total: { $sum: 1 }
                }
              },
              { $sort: { total: -1 } }
            ],
            porIgrejaOrigem: [
              {
                $group: {
                  _id: { $ifNull: ['$listaParticipantes.igreja', 'Não Informado'] },
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
