import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'

export class ApresentacaoMongoRepository {
    private collectionName: string
    constructor() {
        this.collectionName = 'apresentacoes'
    }

    // Tolerante a churchId gravado como string (dados legados corrompidos)
    private churchIdFilter(churchId: string) {
        return {
            $or: [
                { churchId: new ObjectId(churchId) },
                { churchId }
            ]
        }
    }

    async addApresentacao(churchId: string, apresentacao: any): Promise<any> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        const result = await collection.insertOne({
            churchId: new ObjectId(churchId),
            ...apresentacao,
            createdAt: new Date()
        })
        return result
    }

    async getApresentacoes(churchId: string): Promise<any[]> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        const apresentacoes = await collection.find({
            ...this.churchIdFilter(churchId)
        }).sort({ dataApresentacao: -1 }).toArray()

        return apresentacoes
    }

    async getApresentacaoById(churchId: string, apresentacaoId: string): Promise<any> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        const apresentacao = await collection.findOne({
            _id: new ObjectId(apresentacaoId),
            ...this.churchIdFilter(churchId)
        })
        return apresentacao
    }

    async updateApresentacao(churchId: string, apresentacao: any): Promise<any> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        const { _id, churchId: _churchId, createdAt, updatedAt, ...dataToUpdate } = apresentacao

        const result = await collection.updateOne(
            {
                _id: new ObjectId(_id),
                ...this.churchIdFilter(churchId)
            },
            { $set: dataToUpdate }
        )
        return result
    }
}
