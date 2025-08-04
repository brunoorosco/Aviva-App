import {
  createReencontroComDeusService,
  getReencontroComDeusByIdService
} from '@/infra/services/reencontroComDeus'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || ''
    const encontroId = (req.query?.id as string) || ''
    if (req.method == 'PUT') {
      const user = await createReencontroComDeusService(req.body)
      res.status(201).json({ user })
    } else if (req.method == 'GET') {
      const encontro = await getReencontroComDeusByIdService(
        churchId,
        encontroId
      )
      res.send(encontro)
    } else {
      res.send('')
    }
  } catch (error) {
    //@ts-ignore
    console.error(error)
    res.status(400).json({ error: 'Falha na conexão com tb usuário' })
  }
}
