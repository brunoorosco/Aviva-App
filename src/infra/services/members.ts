import { CellsMongoRepository } from '../db/repositories/mongo/cells'
import { UsersMongoRepository } from '../db/repositories/mongo/users'

export const getMembersByCellId = async (
  cemId: string,
  page: number,
  limit: number
) => {
  const userRepository = new UsersMongoRepository()
  const user = await userRepository.getUsersByCellId(cemId, page, limit)
  return user
}

export const getMembersById = async (userId: string) => {
  const userRepository = new UsersMongoRepository()
  const user = await userRepository.geUserById(userId)
  return user
}

export const saveMembers = async (churchId: string, cemId: string) => {
  const userRepository = new UsersMongoRepository()
  const user = await userRepository.create({ cemId: cemId })
  return user
}

export const changeStatusUser = async (userId: string, data: boolean) => {
  const userRepository = new UsersMongoRepository()
  const user = await userRepository.changeStatusUser(userId, data)
  return user
}

export const updateMember = async (userId: string, data: any) => {
  const userRepository = new UsersMongoRepository()
  const user = await userRepository.updateUser(userId, data)
  return user
}

export const addUserImportService = async (churchId: string, data: any) => {
  const userRepository = new UsersMongoRepository()
  const cemRepository = new CellsMongoRepository()
  try {
    for (const key in data) {
      const cem = await cemRepository.getCellsByName(churchId, data[key].rede)
      if (!cem) continue
      const user = await userRepository.create({
        cem: {
          name: cem[0].name,
          id: cem[0]._id.toString()
        },
        churchId: churchId,
        name: data[key].nome,
        email: data[key].email,
        phone: data[key].telefone,
        permission: data[key].permissao,
        cargo: data[key].cargo,
        birth: data[key].aniversario,
        city: data[key].cidade,
        state: data[key].estado,
        street: data[key].rua,
        number: data[key].numero
      })
      if (!user) {
        console.error('Error creating user:', data[key].nome)
      }
    }
    return true
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Error creating user')
    return false
  }
}
