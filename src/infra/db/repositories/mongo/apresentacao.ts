import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'

export class ApresentacaoMongoRepository {
    private collectionName: string
    constructor() {
        this.collectionName = 'apresentacoes'
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
            churchId: new ObjectId(churchId)
        }).sort({ dataApresentacao: -1 }).toArray()

        return apresentacoes
    }

    async getApresentacaoById(churchId: string, apresentacaoId: string): Promise<any> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        const apresentacao = await collection.findOne({
            _id: new ObjectId(apresentacaoId),
            churchId: new ObjectId(churchId)
        })
        return apresentacao
    }

    async updateApresentacao(churchId: string, apresentacao: any): Promise<any> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        const { _id, ...dataToUpdate } = apresentacao

        const result = await collection.updateOne(
            {
                _id: new ObjectId(_id),
                churchId: new ObjectId(churchId)
            },
            { $set: dataToUpdate }
        )
        return result
    }
}
