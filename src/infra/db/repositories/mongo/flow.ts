import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class FlowMongoRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'churchs'
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
}
