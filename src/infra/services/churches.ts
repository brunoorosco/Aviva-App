import { Prisma, Churches as TChurch } from '@prisma/client'
import { prisma } from '@/infra/db/prismaClient'
import { Churches } from '../db/repositories/church'

export const createChurch = async (data: any): Promise<TChurch | Error> => {
  const repositoriesChurch = new Churches()
  try {
    const newChurch: Prisma.ChurchesCreateInput = {
      name: data.church,
      number: data.number,
      cep: data.zipcode.replace('-', ''),
      city: data.city,
      street: data.street,
      state: data.state
    }
    const saved = await repositoriesChurch.create(newChurch)
    return saved
  } catch (error) {
    console.log(error)
    return new Error()
  }
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

export { findChurchesById, findChurches, getChurchbyUserId }
