import { Prisma, CEM } from '@prisma/client'
import { prisma } from '../prismaClient'

type ParamsCem = Prisma.CEMCreateInput

export class Cems {
  async create(data: ParamsCem): Promise<CEM> {
    const cem = await prisma.cEM.create({
      data
    })

    return cem
  }
}
