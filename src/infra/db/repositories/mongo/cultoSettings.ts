import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
import { CultoDomingo, DEFAULT_CULTO_DOMINGO } from '@/domain/models/cultoSettings'

export class CultoSettingsMongoRepository {
  private collectionName: string

  constructor() {
    this.collectionName = 'churchs'
  }

  async getCultoDomingo(churchId: string): Promise<CultoDomingo> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    const church = await collection.findOne(
      { _id: new ObjectId(churchId) },
      { projection: { cultoDomingo: 1 } }
    )
    const value = church?.cultoDomingo
    if (value === 'manha' || value === 'noite' || value === 'manha_e_noite') {
      return value
    }
    return DEFAULT_CULTO_DOMINGO
  }

  async saveCultoDomingo(churchId: string, value: CultoDomingo): Promise<void> {
    const collection = await MongoHelper.getCollection(this.collectionName)
    await collection.updateOne(
      { _id: new ObjectId(churchId) },
      { $set: { cultoDomingo: value } }
    )
  }
}