import { Prisma, CEM } from '@prisma/client'
import { prisma } from '@/infra/db/prismaClient'
import { Cems } from '../db/repositories/cem'
import { CellsMongoRepository } from '../db/repositories/mongo/cells'
import { ObjectId } from 'mongodb'

export const createCem = async (
  data: any,
  churchesId: string
): Promise<CEM> => {
  const cemRepository = new CellsMongoRepository()
  const newCell = {
    name: data.name.toUpperCase(),
    number: data.number,
    cep: data.zipcode.replace('-', ''),
    city: data.city,
    street: data.street,
    state: data.state,
    _id: new ObjectId()
  }
  const saved = await cemRepository.create(churchesId, newCell)
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
  const cemRepository = new CellsMongoRepository()
  const result = await cemRepository.getCells(churchid)

  return result?.cells
}

const deleteCem = async (churchId: string, cemId: string) => {
  const cemRepository = new Cems()
  const result = await cemRepository.delete(churchId, cemId)
  return result
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

export { findCemById, update, findCem, getCembyUserId, deleteCem }
