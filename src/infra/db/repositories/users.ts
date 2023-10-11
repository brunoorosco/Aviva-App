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
}
export async function getAllUsers() {
  const data = await prisma.user.findMany()
  return data
}

export class Users {
  async create(params: ParamsUser): Promise<any> {
    const user = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        birth: new Date(params.birth),
        password: params.password,
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
}
