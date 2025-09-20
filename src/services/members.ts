import { CellsMongoRepository } from '../infra/db/repositories/mongo/cells'
import { UsersMongoRepository } from '../infra/db/repositories/mongo/users'

export const getMembersByCellId = async (
  cemId: string,
  name: string,
  page: number,
  limit: number
) => {
  const userRepository = new UsersMongoRepository()
  const user = await userRepository.getUsersByCellId(cemId, name, page, limit)
  return user
}

export const getMembersById = async (churchId: string, userId: string) => {
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
      const row = data[key]

      const cem = await cemRepository.getCellsByName(churchId, row.rede)
      if (!cem) continue

      // monta dinamicamente o objeto
      const userData: any = {
        cem: {
          name: cem[0].name,
          _id: cem[0]._id.toString(),
        },
        churchId,
        active: true,
      }

      if (row.nome) userData.name = row.nome
      if (row.email) userData.email = row.email.toLowerCase()
      if (row.telefone) userData.phone = row.telefone
      if (row.permissao) userData.permission = row.permissao
      if (row.cargo) userData.role = row.cargo
      if (row.aniversario) userData.birthDate = excelDateToJSDate(row.aniversario)
      if (row.cidade) userData.city = row.cidade
      if (row.estado) userData.state = row.estado
      if (row.rua) userData.street = row.rua
      if (row.numero) userData.number = row.numero
      if (row.encontro) userData.encontrocomDeus = row.encontro
      if (row.reencontro) userData.reencontroComDeus = row.reencontro
      if (row.sejaLivre) userData.sejaLivre = row.sejaLivre
      if (row.cae) userData.cae = row.cae
      if (row.discipulado) userData.discipulado = row.discipulado
      if (row.profeta) userData.escolaProfeta = row.profeta
      if (row.batizado) userData.batizado = row.batizado

      const user = await userRepository.create(userData)

      if (!user) {
        console.error("Error creating user:", row.nome)
      }
    }

    return true
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Error creating user")
  }
}

function excelDateToJSDate(serial: number) {
  const excelEpoch = new Date(1899, 11, 30)
  const jsDate = new Date(excelEpoch.getTime() + serial * 86400000)

  // formatar para yyyy-mm-dd
  const year = jsDate.getFullYear()
  const month = String(jsDate.getMonth() + 1).padStart(2, '0')
  const day = String(jsDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
