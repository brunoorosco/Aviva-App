import { UsersMongoRepository } from '../db/repositories/mongo/users'

export const getMembers = async (cemId: string) => {
  const userRepository = new UsersMongoRepository()
  const user = await userRepository.getUsersByCellId(cemId)
  return user
}

export const getMembersById = async (
  churchId: string,
  cemId: string,
  userId: string
) => {
  const userRepository = new UsersMongoRepository()
  const user = await userRepository.geUserById(userId)
  return user
}

export const saveMembers = async (churchId: string, cemId: string) => {
  const userRepository = new UsersMongoRepository()
  const user = await userRepository.create({ cemId: cemId })
  return user
}
