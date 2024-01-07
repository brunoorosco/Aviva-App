import { Profiles } from '../db/repositories/profile'

export const getProfile = async () => {
  const profileRepository = new Profiles()
  const profile = await profileRepository.getProfile()
  return profile
}

export const getProfileById = async (profileId: number) => {
  const profileRepository = new Profiles()
  const profile = await profileRepository.getProfileId(profileId)
  return profile
}

export const saveProfile = async (churchId: string, description: string) => {
  const profileRepository = new Profiles()
  const profile = await profileRepository.create({ description })
  return profile
}
