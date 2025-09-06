import CryptAdapter from '@/infra/cryptography/bcrypt'
import { UsersMongoRepository } from '@/infra/db/repositories/mongo/users'

type TUser = {
  name: string
  email: string
  phone: string
  zipcode: string
  street: string
  number: string
  city: string
  cemId: string
  birthDate: string
  churchId: string
}

export const createUserByCem = async (params: TUser) => {
  const userRepository = new UsersMongoRepository()
  const cripto = new CryptAdapter()

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
export const createUser = async (params: TUser) => {
  const userRepository = new UsersMongoRepository()
  const cripto = new CryptAdapter()

  const randowPass = await cripto.randonPassword()
  const setPassword = cripto.hashPassword(randowPass)
  const zipcode = params.zipcode?.replace('-', '')

  const cem = params.cemId.split('-')

  if (params && 'cemId' in params) {
    //@ts-ignore
    delete params.cemId
  }

  const user = await userRepository.create({
    ...params,
    permissions: ['user'],
    zipcode,
    password: setPassword,
    cem: { _id: cem[0], name: cem[1] }
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

export const getUsersByCem = async (cemId: string, name: string) => {
  const userRepository = new UsersMongoRepository()
  const members = await userRepository.getUsersByCellId(cemId, name)

  return members
}

export const getUsersByChurch = async (
  churchId: string,
  pageNumber: number,
  limitNumber: number,
  name?: string
) => {
  const userRepository = new UsersMongoRepository()
  const users = await userRepository.getUsersByChurchId(
    churchId,
    pageNumber,
    limitNumber,
    name
  )

  return users
}

export const getUserByName = async (churchId: string, name: string) => {
  const userRepository = new UsersMongoRepository()
  const users = await userRepository.getUserByName(churchId, name)
  return users
}
