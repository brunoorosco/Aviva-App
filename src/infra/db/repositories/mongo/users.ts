import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'
export class UsersMongoRepository {
  private collectionName: string
  constructor() {
    this.collectionName = 'users'
  }

  async getByEmail(email?: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const user = await collection.findOne({ email })

      return user
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async geUserById(id: string): Promise<any> {
    try {
      console.log(id)
      const collection = await MongoHelper.getCollection(this.collectionName)
      //@ts-ignore
      const user = await collection.findOne({ _id: new ObjectId(id) })

      return user
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async create(user: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = collection.insertOne(user)
      return result // Retorna o usuário inserido
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async getUsersByCellId(
    cemId: string,
    name?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: any[]
    total: number
    page: number
    totalPages: number
    totalAtivos: number
    totalInativos: number
  }> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const skip = (page - 1) * limit

      // 🔹 filtro dinâmico
      const filter: any = {
        'cem._id': cemId,
        role: { $ne: 'bispo' } // sempre exclui bispo
      }

      if (name && name.trim().length > 0) {
        filter.name = { $regex: name, $options: 'i' } // case-insensitive
      }

      const [data, total, totalInativos, totalAtivos] = await Promise.all([
        collection
          .find(filter)
          .collation({ locale: 'pt', strength: 1 })
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        collection.countDocuments(filter),
        collection.countDocuments({ active: false, ...filter }),
        collection.countDocuments({ active: true, ...filter })
      ])

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        totalAtivos,
        totalInativos
      }
    } catch (error) {
      console.error('Error get users by cell:', error)
      throw error
    }
  }

  async getUsersByChurch(churchId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = collection.find({}).toArray()
      return result
    } catch (error) {
      console.error('Error get users:', error)
      throw error
    }
  }
  async changeStatusUser(userId: string, data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { active: data ? true : false, updatedAt: new Date() } }
      )
      return result
    } catch (error) {
      console.error('Error get users:', error)
      throw error
    }
  }

  async updateUser(userId: string, data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            ...data, // Espalha as propriedades para atualizar campos individualmente
            updatedAt: new Date()
          }
        }
      )
      return result
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }
  async getUserByName(churchId: string, name: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection
        .find(
          { name: new RegExp(name, 'i'), churchId: churchId },
          {
            projection: {
              name: 1,
              _id: 1
            }
          }
        )
        .toArray()
      return result
    } catch (error) {
      console.error('Error get user:', error)
      throw error
    }
  }

  async getUsersByChurchId(
    churchId: string,
    page: number = 1,
    limit: number = 10,
    name?: string // 🔹 parâmetro opcional
  ): Promise<{
    data: any[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const skip = (page - 1) * limit

      // 🔹 filtro dinâmico
      const filter: any = { churchId }
      if (name && name.trim().length > 0) {
        filter.name = { $regex: name, $options: 'i' } // case-insensitive
      }

      const [data, total] = await Promise.all([
        collection
          .find(filter)
          .collation({ locale: 'pt', strength: 1 })
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        collection.countDocuments(filter)
      ])

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('Error get users with pagination:', error)
      throw error
    }
  }
}
