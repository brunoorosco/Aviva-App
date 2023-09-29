import { Prisma, Churches } from '@prisma/client'
import { prisma } from '@/infra/db/prismaClient'

const create = async (
  newData: Prisma.ChurchesCreateInput
): Promise<Churches> => {
  const saved = await prisma.churches.create({
    data: newData
  })

  return saved
}

const save = async (
  id: string,
  newData: Prisma.ChurchesUpdateInput
): Promise<Churches> => {
  const saved = await prisma.churches.update({
    where: {
      id
    },
    data: newData
  })

  return saved
}

const findChurchesById = async (id: string) => {
  const churches = await prisma.churches.findFirst({
    where: {
      id
    }
  })

  return churches
}

const findChurches = async () => {
  const churches = await prisma.churches.findMany()

  return churches
}

const getChurchbyUserId = async (email: string) => {
  const church = await prisma.user.findFirst({
    where: {
      email
    },
    include: {
      UserCEM: {
        include: {
          cem: { include: { ChurchesCEM: { include: { churches: true } } } }
        }
      }
    }
  })

  const churchId = church?.UserCEM[0].cem.ChurchesCEM[0].churches

  return churchId
}

export { create, findChurchesById, save, findChurches, getChurchbyUserId }
