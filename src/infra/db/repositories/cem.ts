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

  async getCem(churchid: string) {
    const cem = await prisma.cEM.findMany({
      where: { ChurchesCEM: { some: { churches_id: churchid } } }
    })
    return cem
  }

  async delete(churchId: string, cemId: string): Promise<any> {
    const resul = await prisma.cEM.delete({
      where: { id: cemId },
      include: { ChurchesCEM: { where: { churches_id: churchId } } }
    })

    return resul
  }
}
