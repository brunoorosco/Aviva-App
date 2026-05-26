import { TPeople } from '@/domain/models/encontroComDeus'
import { EscolaProfetaRepository } from '@/infra/db/repositories/mongo/escolaProfeta'
import { ChurChMongoRepository } from '../infra/db/repositories/mongo/churchs'

export const getEscolaProfetaService = async (churchId: string) => {
  const escolaRepository = new EscolaProfetaRepository()
  const result = await escolaRepository.getEscolaProfeta(churchId)

  return result
}
export const getEscolaProfetaByIdService = async (
  churchId: string,
  encontroId: string
) => {
  const encontroRepository = new EscolaProfetaRepository()
  const result = await encontroRepository.getEscolaProfetaById(encontroId)

  return result
}

export const createEscolaProfetaService = async (data: any): Promise<any> => {
  const escolaProfetaRepository = new EscolaProfetaRepository()
  const saved = await escolaProfetaRepository.create(data)
  return saved
}

export const updateEscolaProfetaService = async (id: string, data: any): Promise<any> => {
  const escolaProfetaRepository = new EscolaProfetaRepository()
  const saved = await escolaProfetaRepository.update(id, data)
  return saved
}

export const updatePresenEscolaProfetaService = async (
  id: string,
  alunoId: string,
  data: { dia: number; presenca: 'P' | 'F' }
): Promise<any> => {
  const escolaProfetaRepository = new EscolaProfetaRepository()
  const saved = await escolaProfetaRepository.updatePresence(id, alunoId, {
    dia: data.dia,
    presenca: data.presenca === 'P' ? true : false
  })
  return saved
}

function limparObjeto<T extends Record<string, any>>(obj: T): Partial<T> {
  const novo: Partial<T> = {}
  for (const [key, value] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
    if (value !== undefined && value !== '' && value !== null) {
      novo[key] = value
    }
  }
  return novo
}
