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
  const encontroRepository = new EscolaProfetaRepository()
  const churchRepository = new ChurChMongoRepository()
  const churchs = await churchRepository.getChurch()
  const dataNormalizada = normalizarEncontristasPorIgreja(
    data,
    'Avivamento Sede'
  )
  const novoEncontro = {
    data: new Date(),
    encontristas: dataNormalizada
  }
  const saved = await encontroRepository.create(novoEncontro)
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

function normalizarEncontristasPorIgreja(
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

    const obj = {
      nome: entrada.nome,
      idade: entrada.idade,
      telefone: entrada.telefone,
      endereco: entrada.endereco
        ? `${entrada.endereco} ${entrada.bairro}`.trim()
        : null,
      igreja: contemIgreja ? entrada.rede! : nomeDaIgreja,
      ...(contemIgreja ? {} : { rede: entrada.rede })
    }

    return limparObjeto(obj) as TPeople
  })
}
