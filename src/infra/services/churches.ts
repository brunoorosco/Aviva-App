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

// const findChurchesByCEM = async (churchescem: string) => {
//   const churches = await prisma.churches.findFirst({
//     select: {
//       id: true,
//       name: true
//     },
//     where: {
//       : churchescem
//     }
//   })

//   return churches
// }

export { create, findChurchesById, save, findChurches }
