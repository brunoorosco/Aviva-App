import { ChurChMongoRepository } from '../db/repositories/mongo/churchs'

export const createChurchService = async (cemId: string) => {
  const churchRepository = new ChurChMongoRepository()
  const user = await churchRepository.create(cemId)
  return user
}

export const getChurchByIdService = async (churchId: string) => {
  const churchRepository = new ChurChMongoRepository()
  const user = await churchRepository.getChurchById(churchId)
  return user
}

export const getChurchService = async () => {
  const churchRepository = new ChurChMongoRepository()
  const user = await churchRepository.getChurch()
  return user
}

// export const deleteChurchService = async (churchId: string) => {
//   const churchRepository = new ChurChMongoRepository()
//   const user = await churchRepository.create({ _ })
//   return user
// }
