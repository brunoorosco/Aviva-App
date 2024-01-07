import { Prisma, Profile } from '@prisma/client'
import { prisma } from '../prismaClient'

type ParamsCem = Prisma.ProfileCreateInput

export class Profiles {
  async create(data: ParamsCem): Promise<Profile> {
    const profile = await prisma.profile.create({
      data
    })
    return profile
  }

  async getProfile(): Promise<Profile[]> {
    const profile = await prisma.profile.findMany({})
    return profile
  }

  async getProfileId(profileId: number): Promise<Profile> {
    const profile = await prisma.profile.findFirst({
      where: { id: profileId }
    })
    return profile as Profile
  }
}
