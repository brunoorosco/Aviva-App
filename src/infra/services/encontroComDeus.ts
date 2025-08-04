import { TPeople } from '@/domain/models/encontroComDeus'
import { ChurChMongoRepository } from '../db/repositories/mongo/churchs'
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

export const createEncontroComDeusService = async (data: any): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository()
  const churchRepository = new ChurChMongoRepository()
  const churchs = await churchRepository.getChurch()
  const dataNormalizada = normalizarEncontristasPorIgreja(
    data,
    'Avivamento Sede'
  )
  const novoBatismo = {
    data: new Date(),
    encontristas: dataNormalizada
  }
  const saved = await encontroRepository.create(novoBatismo)
  return saved
}

function normalizarEncontristasPorIgreja(
  entradas: (string | TPeople)[],
  nomeDaIgreja: string
): TPeople[] {
  return entradas.map((entrada) => {
    if (typeof entrada === "string") {
      const contemIgreja = entrada.toLowerCase().includes("igreja");

      return {
        nome: "",
        igreja: contemIgreja ? entrada : nomeDaIgreja,
        ...(contemIgreja ? {} : { rede: entrada }),
      };
    }

    const contemIgreja = entrada.rede?.toLowerCase().includes("igreja");

    return {
      nome: entrada.nome,
      igreja: contemIgreja ? entrada.rede! : nomeDaIgreja,
      ...(contemIgreja ? {} : { rede: entrada.rede }),
    };
  });
}