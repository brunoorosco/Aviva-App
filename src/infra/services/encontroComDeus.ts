import { EncontroComDeusRepository } from '../db/repositories/mongo/encontroComDeus'

export const getEncontroComDeusService = async (churchId: string) => {
  const encontroRepository = new EncontroComDeusRepository()
  const result = await encontroRepository.getEncontroComDeus(churchId)

  return result
}

export const createEncontroComDeusService = async (data: any): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository()
  const novoBatismo = {
    data: new Date(),
    batizandos: data
  }
  const saved = await encontroRepository.create(novoBatismo)
  return saved
}
