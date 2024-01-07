import { getProfile, getProfileById } from '@/infra/services/profile'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { profileId } = req.query
    if (req.method == 'GET') {
      const profile = await getProfileById(parseInt(profileId as string))
      res.send(profile)
    } else {
      res.send('')
    }
  } catch (error) {
    //@ts-ignore
    console.error(error)
    res.status(400).json({ error: 'Falha na conexão com tb usuário' })
  }
}
