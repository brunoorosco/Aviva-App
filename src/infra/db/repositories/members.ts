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
    const userDb =
      await prisma.$queryRaw`SELECT user.id, user.name, email, birth, image, ad.* from user 
      left join cem c on c.id = user.cem_id
      left join address ad on ad.user_id = user.id
      where user.cem_id  = ${params.cemId}`

    return userDb as TMembers[]
  }
}
