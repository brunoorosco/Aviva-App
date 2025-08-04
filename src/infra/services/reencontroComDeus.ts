import { TPeople } from '@/domain/models/encontroComDeus'
import { ChurChMongoRepository } from '../db/repositories/mongo/churchs'
import { ReencontroComDeusRepository } from '../db/repositories/mongo/reencontroComDeus'

export const getReencontroComDeusService = async (churchId: string) => {
  const encontroRepository = new ReencontroComDeusRepository()
  const result = await encontroRepository.getReencontroComDeus(churchId)

  return result
}
export const getReencontroComDeusByIdService = async (
  churchId: string,
  encontroId: string
) => {
  const encontroRepository = new ReencontroComDeusRepository()
  const result = await encontroRepository.getReencontroComDeusById(encontroId)

  return result
}

export const createReencontroComDeusService = async (
  data: any
): Promise<any> => {
  const encontroRepository = new ReencontroComDeusRepository()
  const churchRepository = new ChurChMongoRepository()
  const churchs = await churchRepository.getChurch()
  const dataNormalizada = normalizarReencontristasPorIgreja(
    data,
    'Avivamento Sede'
  )
  const reencontro = {
    data: new Date(),
    encontristas: data
  }
  const saved = await encontroRepository.create(reencontro)
  return saved
}

function normalizarReencontristasPorIgreja(
  entradas: (string | TPeople)[],
  nomeDaIgreja: string
): TPeople[] {
  return entradas.map((entrada) => {
    if (typeof entrada === 'string') {
      const contemIgreja = entrada.toLowerCase().includes('igreja')

      return {
        nome: '',
        igreja: contemIgreja ? entrada : nomeDaIgreja,
        ...(contemIgreja ? {} : { rede: entrada })
      }
    }

    const contemIgreja = entrada.rede?.toLowerCase().includes('igreja')

    return {
      nome: entrada.nome,
      igreja: contemIgreja ? entrada.rede! : nomeDaIgreja,
      ...(contemIgreja ? {} : { rede: entrada.rede })
    }
  })
}
