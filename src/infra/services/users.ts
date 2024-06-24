import CryptAdapter from '../cryptography/bcrypt'
import { Users } from '../db/repositories/users'

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
}

export const createUser = async (params: TUser) => {
  const cripto = new CryptAdapter()
  const userRepository = new Users()
  const randowPass = await cripto.randonPassword()
  //TO-DO fazer chma pra enviar o email com a Senha
  console.log('random pass--->', randowPass)
  const setPassword = cripto.hashPassword(randowPass)
  const zipcode = params.zipcode?.replace('-', '')
  const user = await userRepository.create({
    ...params,
    zipcode,
    password: setPassword
  })
  return user
}

export const getUserSupervisories = async (churchId: string) => {
  const userRepository = new Users()
  const supers = await userRepository.getUserSupervisories(churchId)
  return supers
}
export const getUserSupervisoriesCem = async (
  churchId: string,
  cemId: string
) => {
  const userRepository = new Users()
  const supers = await userRepository.getUserSupervisoriesCem(churchId, cemId)
  return supers
}

export const updatedUserCem = async (cemId: string, userId: string) => {
  const userRepository = new Users()
  const user = await userRepository.updatedUserCem(cemId, userId)
  return user
}
