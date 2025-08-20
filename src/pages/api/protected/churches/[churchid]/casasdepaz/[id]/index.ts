import { getCasasdePazByIdService } from '@/infra/services/casasdepaz'
import { createEncontroComDeusService } from '@/infra/services/encontroComDeus'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || ''
    const casadepazId = (req.query?.id as string) || ''
    if (req.method == 'PUT') {
      const user = await createEncontroComDeusService(req.body)
      res.status(200).json({ user })
    } else if (req.method == 'GET') {
      const encontro = await getCasasdePazByIdService(churchId, casadepazId)
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
