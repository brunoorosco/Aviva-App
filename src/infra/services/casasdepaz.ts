import { CasaDePaz } from '@/domain/models/casaDePaz'
import { ObjectId } from 'mongodb'
import { CasasDePazRepository } from '../db/repositories/mongo/casasDePaz'
import { EncontroComDeusRepository } from '../db/repositories/mongo/encontroComDeus'

export const getCasasDePazService = async (churchId: string) => {
  const casasdePazRepository = new CasasDePazRepository()
  const result = await casasdePazRepository.getCasasDePaz(churchId)

  return result
}
export const getCasasdePazByIdService = async (
  churchId: string,
  casaDePazId: string
) => {
  const casasdePazRepository = new CasasDePazRepository()
  const result = await casasdePazRepository.getCasasDePazById(casaDePazId)

  return result
}

export const createCasasDePazService = async (
  churchId: string,
  data: { casas: CasaDePaz[]; data_inicial: string }
): Promise<any> => {
  const casasdePazRepository = new CasasDePazRepository()
  const casaMap = data.casas.map((casa) => {
    return { ...casa, _id: new ObjectId() }
  })

  const response = await casasdePazRepository.createCasaDePaz({
    church_id: churchId,
    data_inicial: data.data_inicial,
    casas: casaMap
  })
  return response
}
