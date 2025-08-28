import CryptAdapter from '../cryptography/bcrypt'
import { ChurChMongoRepository } from '../db/repositories/mongo/churchs'
import { UsersMongoRepository } from '../db/repositories/mongo/users'

type TUser = {
  name: string
  email: string
  phone: string
  zipcode: string
  street: string
  number: string
  city: string
  cemId: string
  birth: string
  churchId: string
}

export const createUser = async (params: TUser) => {
  const church = new ChurChMongoRepository()
  const userRepository = new UsersMongoRepository()
  const cripto = new CryptAdapter()

  const churchId = await church.getChurchById(params.churchId)
  const randowPass = await cripto.randonPassword()

  const setPassword = cripto.hashPassword(randowPass)
  const zipcode = params.zipcode?.replace('-', '')

  const user = await userRepository.create({
    ...params,
    permissions: ['user'],
    zipcode,
    password: setPassword
  })
  return user
}

// export const getUserSupervisories = async (churchId: string) => {
//   const userRepository = new Users()
//   const supers = await userRepository.getUserSupervisories(churchId)
//   return supers
// }
// export const getUserSupervisoriesCem = async (
//   churchId: string,
//   cemId: string
// ) => {
//   const userRepository = new Users()
//   const supers = await userRepository.getUserSupervisoriesCem(churchId, cemId)
//   return supers
// }

// export const updatedUserCem = async (cemId: string, userId: string) => {
//   const userRepository = new Users()
//   const user = await userRepository.updatedUserCem(cemId, userId)
//   return user
// }

export const getUsersByCem = async (cemId: string) => {
  const userRepository = new UsersMongoRepository()
  const members = await userRepository.getUsersByCellId(cemId)

  return members
}

export const getUsersByChurch = async (
  churchId: string,
  pageNumber: number,
  limitNumber: number
) => {
  const userRepository = new UsersMongoRepository()
  const users = await userRepository.getUsersByChurchId(
    churchId,
    pageNumber,
    limitNumber
  )

  return users
}

export const getUserByName = async (
  churchId: string,
  name: string
) => {
  const userRepository = new UsersMongoRepository()
  const users = await userRepository.getUserByName(
    churchId,
    name
   )
  return users
  }
