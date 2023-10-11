import { Prisma, Churches } from '@prisma/client'
import { prisma } from '@/infra/db/prismaClient'

const create = async (params: any): Promise<Churches | Error> => {
  const saved = await prisma.churches.create({
    data: {
      name: params.name,
      cep: params.cep,
      city: params.city,
      number: params.number,
      state: params.state,
      street: params.street
    }
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
