import { withAudit } from '@/middlewares/withAudit';
import {
  getReencontroComDeusByIdService,
  updateReencontroComDeusService,
  updateReencontroAllowPastEditsService,
} from '@/services/reencontroComDeus'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const churchId = (req.query?.churchid as string) || ''
    const reencontroId = (req.query?.id as string) || ''
    if (req.method == 'PUT') {
      const user = await updateReencontroComDeusService(reencontroId, req.body)
      res.status(200).json({ user })
    } else if (req.method == 'PATCH') {
      const result = await updateReencontroAllowPastEditsService(reencontroId, req.body.allowPastEdits)
      res.status(200).json({ result })
    } else if (req.method == 'GET') {
      const reencontro = await getReencontroComDeusByIdService(churchId, reencontroId)
      res.send(reencontro)
    } else {
      res.send('')
    }
  } catch (error) {
    //@ts-ignore
    console.error(error)
    res.status(400).json({ error: 'Falha na conexão com tb usuário' })
  }
}

export default withAudit(handler);