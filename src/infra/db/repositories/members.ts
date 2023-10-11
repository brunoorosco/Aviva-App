import { prisma } from '../prismaClient'

type TAddress = {
  street: string
  number: string
  city: string
  cep: string
  state: string
}

export type TMembers = {
  id: string
  name: string
  email: string
  birth?: Date
  image?: string
  address?: TAddress[]
}

type ParamsMembers = {
  cemId: string
}

export class Members {
  async getMembers(params: ParamsMembers): Promise<TMembers[]> {
    const userDb = await prisma.user.findMany({
      where: { UserCEM: { some: { cem_id: params.cemId } } },
      select: {
        id: true,
        name: true,
        email: true,
        birth: true,
        image: true,
        address: true
      }
    })
    return userDb as TMembers[]
  }
}
