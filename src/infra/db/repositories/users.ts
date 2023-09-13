import { prisma } from '../prismaClient'

export interface TUser {
  id?: string
  name: string
  password?: string
  email: string
}

export async function getAllUsers() {
  const data = await prisma.user.findMany()
  return data
}

// export async function createTodo(user: TUser) {
//   await prisma.user.create({
//     data: { user }
//   })
// }
