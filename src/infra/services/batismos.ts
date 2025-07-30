import { ObjectId } from 'mongodb'
import { BatismoMongoRepository } from '../db/repositories/mongo/batismo'

export const getBatismoService = async () => {
  const batismoRepository = new BatismoMongoRepository()
  const result = await batismoRepository.getBatismo()

  return result
}

export const createBatismoService = async (data: any): Promise<any> => {
  const batismoRepository = new BatismoMongoRepository()
  console.log(data)
  const novoBatismo = {
    data: new Date(),
    batizandos: data
  }
  const saved = await batismoRepository.create(novoBatismo)
  return saved
}
