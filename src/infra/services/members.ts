import { Members } from '../db/repositories/members'

export const getMembers = async (churchId: string, cemId: string) => {
  const userRepository = new Members()
  const user = await userRepository.getMembers({ cemId: cemId })
  return user
}
