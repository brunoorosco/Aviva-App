import { CasaDePaz } from '@/domain/models/casaDePaz'
import { VisitasDePazRepository } from '@/infra/db/repositories/mongo/visitasDePaz'
import { ObjectId } from 'mongodb'

const visitasdePazRepository = new VisitasDePazRepository()
export const getVisitasDePazService = async (churchId: string) => {
  const result = await visitasdePazRepository.getVisitasDePaz(churchId)

  return result
}
export const getVisitasDePazByIdService = async (
  churchId: string,
  casaDePazId: string
) => {
  const result = await visitasdePazRepository.getVisitasDePazById(casaDePazId)

  return result
}

export const createVisitasDePazService = async (
  churchId: string,
  data: { casas: CasaDePaz[]; data_inicial: string }
): Promise<any> => {
  const casaMap = data.casas.map((casa) => {
    return { ...casa, _id: new ObjectId() }
  })
  const response = await visitasdePazRepository.createVisitasDePaz({
    church_id: churchId,
    data_inicial: data.data_inicial,
    casas: casaMap
  })
  return response
}

export const saveVisitaDePazService = async (params: {
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
    return visitasdePazRepository.updateCasa(visitaId, casa)
  }

  // Adiciona nova casa em documento existente
  return visitasdePazRepository.addCasa(visitaId, casa)
}
