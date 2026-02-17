import { CasaDePaz } from '@/domain/models/casaDePaz'
import { CemsRepository } from '@/infra/db/repositories/mongo/cems'
import { ObjectId } from 'mongodb'

const cemsRepository = new CemsRepository()

export const getCemsService = async (churchId: string) => {
  const result = await cemsRepository.getCems(churchId)

  return result
}

export const getCemsByIdService = async (
  churchId: string,
  casaDePazId: string
) => {
  const result = await cemsRepository.getCemsById(casaDePazId)

  return result
}

export const createCemsService = async (
  churchId: string,
  data: { casas: CasaDePaz[]; data_inicial: string }
): Promise<any> => {
  const casaMap = data.casas.map((casa) => {
    return { ...casa, _id: new ObjectId() }
  })

  const response = await cemsRepository.createCems({
    church_id: churchId,
    data_inicial: data.data_inicial,
    casas: casaMap
  })
  return response
}

export const saveCemservice = async (params: {
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
    return cemsRepository.updateCasa(visitaId, casa)
  }

  // Adiciona nova casa em documento existente
  return cemsRepository.addCasa(visitaId, casa)
}
