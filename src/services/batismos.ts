import { BatismoMongoRepository } from '../infra/db/repositories/mongo/batismo'

export const getBatismoService = async (churchId: string) => {
  const batismoRepository = new BatismoMongoRepository()
  const result = await batismoRepository.getBatismo(churchId)

  return result
}

export const getBatismoByIdService = async (churchId: string, id: string) => {
  const batismoRepository = new BatismoMongoRepository()
  const result = await batismoRepository.getBatismoById(churchId, id)

  return result
}

export const createBatismoService = async (data: any): Promise<any> => {
  const batismoRepository = new BatismoMongoRepository()
  const novoBatismo = {
    data: new Date(),
    batizandos: data
  }
  const saved = await batismoRepository.create(novoBatismo)
  return saved
}
