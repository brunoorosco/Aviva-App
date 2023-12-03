import CryptAdapter from '../cryptography/bcrypt'
import { User } from '../db/repositories/user'
import { Users } from '../db/repositories/users'

export const createUser = async (params: any) => {
  const cripto = new CryptAdapter()
  const userRepository = new Users()
  const randowPass = await cripto.randonPassword()
  //TO-DO fazer chma pra enviar o email com a Senha
  console.log(randowPass)
  const setPassword = cripto.hashPassword(randowPass)
  const user = await userRepository.create({ password: setPassword, ...params })
  return user
}

export const getUserSupervisories = async (churchId: string) => {
  const userRepository = new Users()
  const supers = await userRepository.getUserSupervisories(churchId)
  return supers
}

export const updatedUserCem = async (cemId: string, userId: string) => {
  const userRepository = new Users()
  const user = await userRepository.updatedUserCem(cemId, userId)
  return user
}
