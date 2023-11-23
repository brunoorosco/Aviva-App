import { Prisma, Churches as TChurch } from '@prisma/client'
import { prisma } from '../prismaClient'

type ParamsChurch = Prisma.ChurchesCreateInput

export class Churches {
  async create(data: ParamsChurch): Promise<TChurch> {
    const church = await prisma.churches.create({
      data
    })

    return church
  }
}
