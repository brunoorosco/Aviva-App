import { CasaDePaz } from '@/domain/models/casaDePaz'
import { CasasDePazRepository } from '../db/repositories/mongo/casasDePaz'
import { EncontroComDeusRepository } from '../db/repositories/mongo/encontroComDeus'

export const getEncontroComDeusService = async (churchId: string) => {
  const encontroRepository = new EncontroComDeusRepository()
  const result = await encontroRepository.getEncontroComDeus(churchId)

  return result
}
export const getEncontroComDeusByIdService = async (
  churchId: string,
  encontroId: string
) => {
  const encontroRepository = new EncontroComDeusRepository()
  const result = await encontroRepository.getEncontroComDeusById(encontroId)

  return result
}

export const createCasasDePazService = async (
  churchId: string,
  data: { casas: CasaDePaz[]; data: string }
): Promise<any> => {
  const casasdePazRepository = new CasasDePazRepository()
  const response = await casasdePazRepository.createCasaDePaz({
    church_id: churchId,
    data: data.data,
    casas: data.casas
  })
  return response
}
