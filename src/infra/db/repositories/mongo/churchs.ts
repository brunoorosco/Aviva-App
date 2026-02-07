import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class ChurChMongoRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'churchs'
  }

  async getChurchById(churchId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const church = await collection.findOne({ _id: new ObjectId(churchId) })
      return church
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async getChurch(): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const church = await collection.find({}).toArray()

    return church
  }

  async create(user: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.insertOne(user)
      return result // Retorna o usuário inserido
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }
  // Salvar ou atualizar o organograma (flow) dentro da igreja
  async saveFlow(churchId: string, flowData: any): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const result = await collection.updateOne(
      { _id: new ObjectId(churchId) },
      { $set: { organograma: flowData } }, // subdocumento organograma
      { upsert: true }
    )
    return result
  }

  // Buscar o organograma de uma igreja
  async getFlow(churchId: string): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const church = await collection.findOne(
      { _id: new ObjectId(churchId) },
      { projection: { organograma: 1 } }
    )
    return church?.organograma || null
  }
  async addApresentacao(churchId: string, apresentacao: any): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const result = await collection.updateOne(
      { _id: new ObjectId(churchId) },
      { $push: { apresentacao: { _id: new ObjectId(), ...apresentacao } } }
    )
    return result
  }
  async getApresentacoes(churchId: string): Promise<any[]> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const church = await collection.findOne(
      { _id: new ObjectId(churchId) },
      { projection: { apresentacao: { $sortArray: { input: '$apresentacao', sortBy: { dataApresentacao: -1 } } } } }
    )
    return church?.apresentacao || []
  }

  async getApresentacaoById(churchId: string, apresentacaoId: string): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const church = await collection.findOne(
      { _id: new ObjectId(churchId), 'apresentacao._id': new ObjectId(apresentacaoId) },
      { projection: { 'apresentacao.$': 1 } }
    )
    return church?.apresentacao?.[0] || null
  }

  async updateApresentacao(churchId: string, apresentacao: any): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const { _id, ...dataToUpdate } = apresentacao

    // Construct dynamic set object
    const setQuery = Object.keys(dataToUpdate).reduce((acc: any, key) => {
      acc[`apresentacao.$.${key}`] = dataToUpdate[key];
      return acc;
    }, {});

    const result = await collection.updateOne(
      {
        _id: new ObjectId(churchId),
        'apresentacao._id': new ObjectId(_id)
      },
      { $set: setQuery }
    )
    return result
  }
}
