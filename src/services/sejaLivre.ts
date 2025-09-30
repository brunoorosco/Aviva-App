import { TPeople } from '@/domain/models/encontroComDeus'
import { ChurChMongoRepository } from '../infra/db/repositories/mongo/churchs'
import { SejaLivreRepository } from '../infra/db/repositories/mongo/sejaLivre'

export const getSejaLivreService = async (churchId: string) => {
  const encontroRepository = new SejaLivreRepository()
  const result = await encontroRepository.getSejaLivre(churchId)

  return result
}
export const getSejaLivreByIdService = async (
  churchId: string,
  encontroId: string
) => {
  const encontroRepository = new SejaLivreRepository()
  const result = await encontroRepository.getSejaLivreById(encontroId)

  return result
}

export const createSejaLivreService = async (data: any): Promise<any> => {
  const encontroRepository = new SejaLivreRepository()
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
  console.log(novoEncontro)
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
      endereco: entrada.endereco ? `${entrada.endereco} ${entrada.bairro}`.trim() : null,
      igreja: contemIgreja ? entrada.rede! : nomeDaIgreja,
      ...(contemIgreja ? {} : { rede: entrada.rede })
    }

    return limparObjeto(obj) as TPeople
  })
}
