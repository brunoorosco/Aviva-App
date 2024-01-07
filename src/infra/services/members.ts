import { Members } from '../db/repositories/members'

export const getMembers = async (churchId: string, cemId: string) => {
  const userRepository = new Members()
  const user = await userRepository.getMembers({ cemId: cemId })
  return user
}

export const getMembersById = async (
  churchId: string,
  cemId: string,
  userId: string
) => {
  const userRepository = new Members()
  const user = await userRepository.getMembersById(userId)
  return user
}

export const saveMembers = async (churchId: string, cemId: string) => {
  const userRepository = new Members()
  const user = await userRepository.getMembers({ cemId: cemId })
  return user
}
