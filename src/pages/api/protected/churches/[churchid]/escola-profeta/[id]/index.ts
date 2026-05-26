import { withAudit } from '@/middlewares/withAudit';
import {
  updateEscolaProfetaService,
  getEscolaProfetaByIdService,
} from '@/services/escolaProfeta'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const churchId = (req.query?.churchid as string) || ''
    const courseId = (req.query?.id as string) || ''
    if (req.method == 'PUT') {
      const course = await updateEscolaProfetaService(courseId, req.body)
      res.status(200).json({ course })
    } else if (req.method == 'GET') {
      const course = await getEscolaProfetaByIdService(churchId, courseId)
      res.send(course)
    } else {
      res.send('')
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export default withAudit(handler);