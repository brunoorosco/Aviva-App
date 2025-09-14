import {
  createEscolaProfetaService,
  getEscolaProfetaService
} from '@/services/escolaProfeta'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || ''
    if (req.method == 'POST') {
      const course = await createEscolaProfetaService(req.body)
      res.status(201).json({ course })
    } else if (req.method == 'GET') {
      const course = await getEscolaProfetaService(churchId)
      res.send(course)
    } else {
      res.send('')
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
