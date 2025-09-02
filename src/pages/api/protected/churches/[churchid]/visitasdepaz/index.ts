import { createVisitasDePazService, getVisitasDePazService } from '@/services/visitasdepaz'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || ''
    if (req.method == 'POST') {
      const user = await createVisitasDePazService(churchId, req.body)
      res.status(201).json({ user })
    } else if (req.method == 'GET') {
      const casas = await getVisitasDePazService(churchId)
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
