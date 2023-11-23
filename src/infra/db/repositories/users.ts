import { prisma } from '../prismaClient'

export interface TUser {
  id?: string
  name: string
  password?: string
  email: string
}

type TAddress = {
  street: string
  number: string
  city: string
  cep: string
  state: string
}

type ParamsUser = {
  name: string
  email: string
  birth: string
  password: string
  address: TAddress
  profile_id?: number
}

export class Users {
  async create(params: ParamsUser): Promise<any> {
    const user = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        birth: new Date(params.birth),
        password: params.password,
        profile_id: params.profile_id,
        address: {
          create: {
            cep: params.address.cep,
            city: params.address.city,
            number: params.address.number,
            state: params.address.state,
            street: params.address.street
          }
        }
      }
    })

    return user
  }

  async checkByEmail(email: string): Promise<any> {
    const isValid = await prisma.user.findUnique({
      where: {
        email
      }
    })
    return isValid
  }

  async getUserSupervisories(churchId: string): Promise<any> {
    const query = await prisma.$queryRaw`
    SELECT user.name, user.id from user 
    join churchescem c2 on c2.cem_id = user.cem_id 
    where user.profile_id = 4 and c2.churches_id = ${churchId}`

    return query
  }
}
