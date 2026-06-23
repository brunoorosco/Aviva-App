import {
  getEncontroComDeusByIdService,
  updateEncontroComDeusService,
  updateEncontroAllowPastEditsService,
} from '@/services/encontroComDeus'
import { NextApiRequest, NextApiResponse } from 'next'
import { withAudit } from '@/middlewares/withAudit'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || ''
    const encontroId = (req.query?.id as string) || ''
    if (req.method == 'PUT') {
      const user = await updateEncontroComDeusService(encontroId, req.body)
      res.status(200).json({ user })
    } else if (req.method == 'PATCH') {
      const result = await updateEncontroAllowPastEditsService(encontroId, req.body.allowPastEdits)
      res.status(200).json({ result })
    } else if (req.method == 'GET') {
      const encontro = await getEncontroComDeusByIdService(churchId, encontroId)
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

export default withAudit(handler)

