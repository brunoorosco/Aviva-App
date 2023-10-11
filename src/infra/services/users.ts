import CryptAdapter from '../cryptography/bcrypt'
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
