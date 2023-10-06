import { Prisma, CEM } from '@prisma/client'
import { prisma } from '@/infra/db/prismaClient'

const create = async (newData: Prisma.CEMCreateInput): Promise<CEM> => {
  const saved = await prisma.cEM.create({
    data: newData
  })

  return saved
}

const update = async (
  id: string,
  newData: Prisma.CEMCreateInput
): Promise<CEM> => {
  const saved = await prisma.cEM.update({
    where: {
      id
    },
    data: newData
  })

  return saved
}

const findCemById = async (churchid: string, cemid: string) => {
  const cem = await prisma.cEM.findFirst({
    where: {
      id: cemid,
      ChurchesCEM: { some: { churches_id: churchid } }
    }
  })
  return cem
}

const findCem = async (churchid: string) => {
  const cem = await prisma.cEM.findMany({
    where: { ChurchesCEM: { some: { churches_id: churchid } } }
  })
  return cem
}

const getCembyUserId = async (email: string) => {
  const church = await prisma.user.findUnique({
    where: {
      email
    },
    include: {
      UserCEM: {
        include: {
          cem: true
        }
      }
    }
  })

  const cem = church?.UserCEM[0].cem

  return cem
}

export { create, findCemById, update, findCem, getCembyUserId }
