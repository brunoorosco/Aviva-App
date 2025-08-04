import { EncontroComDeusRepository } from '../db/repositories/mongo/encontroComDeus'

export const getEncontroComDeusService = async (churchId: string) => {
  const encontroRepository = new EncontroComDeusRepository()
  const result = await encontroRepository.getEncontroComDeus(churchId)

  return result
}
export const getEncontroComDeusByIdService = async (churchId: string, encontroId:string) => {
  const encontroRepository = new EncontroComDeusRepository()
  const result = await encontroRepository.getEncontroComDeusById(encontroId)

  return result
}

export const createEncontroComDeusService = async (data: any): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository()
  console.log(data)
  const novoBatismo = {
    data: new Date(),
    encontristas: data
  }
  const saved = await encontroRepository.create(novoBatismo)
  return saved
}
