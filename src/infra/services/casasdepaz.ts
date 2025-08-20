import { CasaDePaz } from '@/domain/models/casaDePaz'
import { ObjectId } from 'mongodb'
import { CasasDePazRepository } from '../db/repositories/mongo/casasDePaz'

const casasdePazRepository = new CasasDePazRepository()

export const getCasasDePazService = async (churchId: string) => {
  const result = await casasdePazRepository.getCasasDePaz(churchId)

  return result
}
export const getCasasdePazByIdService = async (
  churchId: string,
  casaDePazId: string
) => {
  const result = await casasdePazRepository.getCasasDePazById(casaDePazId)

  return result
}

export const createCasasDePazService = async (
  churchId: string,
  data: { casas: CasaDePaz[]; data_inicial: string }
): Promise<any> => {
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

export const saveCasaDePazService = async (params: {
  visitaId?: string // se existir, faz update/add
  church_id: string
  dataInicial?: string
  casa: CasaDePaz
}) => {
  const { visitaId, casa } = params
  if (!visitaId) {
    throw new Error('Data inicial é obrigatória para nova visita')
  }

  if (casa._id) {
    // Edita casa existente
    return casasdePazRepository.updateCasa(visitaId, casa)
  }

  // Adiciona nova casa em documento existente
  return casasdePazRepository.addCasa(visitaId, casa)
}
