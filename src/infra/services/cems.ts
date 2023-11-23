import { Prisma, CEM } from '@prisma/client'
import { prisma } from '@/infra/db/prismaClient'
import { Cems } from '../db/repositories/cem'

export const createCem = async (
  data: any,
  churchesId: string
): Promise<CEM> => {
  const cemRepository = new Cems()
  const newCem: Prisma.CEMCreateInput = {
    name: data.name,
    number: data.number,
    cep: data.zipcode.replace('-', ''),
    city: data.city,
    street: data.street,
    state: data.state,
    ChurchesCEM: { create: { churches_id: churchesId } }
  }
  const saved = await cemRepository.create(newCem)
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

export { findCemById, update, findCem, getCembyUserId }
