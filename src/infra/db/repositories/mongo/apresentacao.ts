import { ObjectId } from "mongodb";
import { MongoHelper } from "../../mongoHelper";

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

    async deleteApresentacao(churchId: string, apresentacaoId: string): Promise<any> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        const result = await collection.deleteOne({
            _id: new ObjectId(apresentacaoId),
            ...this.churchIdFilter(churchId)
        })
        return result
    }

    /* =======================
       CURSOS DE APRESENTAÇÃO DE CRIANÇAS
       - Docs de tipo 'cursoCrianca' vivem na MESMA collection.
       - Cascata: apaga o curso E os criancas gerados (por cursoId).
     ======================= */

    async getCursoCrianca(churchId: string, id: string): Promise<any> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        return await collection.findOne({
            _id: new ObjectId(id),
            tipo: 'cursoCrianca',
            ...this.churchIdFilter(churchId)
        })
    }

    async getTodosCursoCrianca(churchId: string): Promise<any[]> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        return await collection
            .find({ tipo: 'cursoCrianca', ...this.churchIdFilter(churchId) })
            .sort({ dataCurso: -1, createdAt: -1 })
            .toArray()
    }

    async createCursoCrianca(churchId: string, data: any): Promise<any> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        const result = await collection.insertOne({
            churchId: new ObjectId(churchId),
            ...data,
            createdAt: new Date()
        })
        return result
    }

    async insertManyCrianca(churchId: string, kids: any[]): Promise<{ insertedIds: ObjectId[] }> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        const docs = kids.map((k) => ({
            churchId: new ObjectId(churchId),
            ...k,
            createdAt: new Date(),
        }))
        const result = await collection.insertMany(docs)
        return { insertedIds: Object.values(result.insertedIds) as ObjectId[] }
    }

    async updateCursoCriancaItems(churchId: string, cursoId: string, itemIds: string[]): Promise<any> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        return await collection.updateOne(
            {
                _id: new ObjectId(cursoId),
                tipo: 'cursoCrianca',
                ...this.churchIdFilter(churchId)
            },
            { $set: { cursoItems: itemIds } }
        )
    }

    async getApresentacoesPorCursoId(churchId: string, cursoId: string): Promise<any[]> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        return await collection
            .find({
                cursoId: new ObjectId(cursoId),
                ...this.churchIdFilter(churchId)
            })
            .toArray()
    }

    /**
     * Apaga um curso + todas as apresentações de crianças geradas a partir
     * dele (via `cursoId`). Retorna { removed: { curso: 0|1, criancas: N } }.
     */
    async deleteCursoCriancaCascade(churchId: string, cursoId: string): Promise<{ removed: { curso: number; criancas: number } }> {
        const collection = await MongoHelper.getCollection(this.collectionName)
        // 1) Busca os criancas gerados
        const kids = await collection.find({
            cursoId: new ObjectId(cursoId),
            ...this.churchIdFilter(churchId)
        }).toArray()

        // 2) Apaga as crianças
        if (kids.length > 0) {
            await collection.deleteMany({
                _id: { $in: kids.map((k) => k._id) }
            })
        }

        // 3) Apaga o curso
        const cursoRes = await collection.deleteOne({
            _id: new ObjectId(cursoId),
            tipo: 'cursoCrianca',
            ...this.churchIdFilter(churchId)
        })

        return { removed: { curso: cursoRes.deletedCount ?? 0, criancas: kids.length } }
    }
}
