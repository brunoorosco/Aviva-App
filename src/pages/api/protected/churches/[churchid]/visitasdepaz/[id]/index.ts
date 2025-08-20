import {
  createEncontroComDeusService,
  getEncontroComDeusByIdService,
} from '@/infra/services/encontroComDeus'
import { getVisitasDePazByIdService } from '@/infra/services/visitasdepaz'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || ''
    const visitadepazId = (req.query?.id as string) || ''
    if (req.method == 'PUT') {
      const user = await createEncontroComDeusService(req.body)
      res.status(201).json({ user })
    } else if (req.method == 'GET') {
      const casas = await getVisitasDePazByIdService(churchId, visitadepazId)
      res.send(casas)
    } else {
      res.send('')
    }
  } catch (error) {
    //@ts-ignore
    console.error(error)
    res.status(400).json({ error: 'Falha na conexão com tb usuário' })
  }
}
