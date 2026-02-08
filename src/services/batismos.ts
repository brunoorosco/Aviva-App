import { BatismoMongoRepository } from '../infra/db/repositories/mongo/batismo'

type Person = {
  name: string
  supervisorId: string
  sexo: '' | 'M' | 'F'
}

export const getBatismoService = async (churchId: string) => {
  const batismoRepository = new BatismoMongoRepository()
  const result = await batismoRepository.getBatismo(churchId)

  return result
}

export const getBatismoByIdService = async (churchId: string, id: string) => {
  const batismoRepository = new BatismoMongoRepository()
  const result = await batismoRepository.getBatismoById(churchId, id)

  return result
}

export const createBatismoService = async (
  data: any,
  churchId: string
): Promise<any> => {
  const batismoRepository = new BatismoMongoRepository()

  const batizandos = data.people.map((p: Person) => ({
    nome: p.name,
    rede: p.supervisorId.split('|')[1],
    churchId: churchId,
    sexo: p.sexo
  }))

  const novoBatismo = {
    data: new Date(data.date),
    local: data.local,
    batizandos
  }
  const saved = await batismoRepository.create(novoBatismo)
  return saved
}

export const createBatismoImportedService = async (
  data: any,
  churchId: string
): Promise<any> => {
  const batismoRepository = new BatismoMongoRepository()

  const batizandos = data.map((p: any) => ({
    nome: p.nome,
    rede: p.rede,
    churchId: churchId,
    sexo: p.sexo
  }))

  const novoBatismo = {
    data: new Date(data.date),
    local: data.local,
    batizandos
  }
  const saved = await batismoRepository.create(novoBatismo)
  return saved
}
