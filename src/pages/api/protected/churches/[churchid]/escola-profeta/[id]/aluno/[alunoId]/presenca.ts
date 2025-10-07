import { updatePresenEscolaProfetaService } from '@/services/escolaProfeta'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const courseId = (req.query?.id as string) || ''
    const alunoId = (req.query?.alunoId as string) || ''
    if (req.method == 'PUT') {
      const course = await updatePresenEscolaProfetaService(courseId, alunoId, {
        dia: req.body?.dia,
        presenca: req.body?.presenca
      })
      res.send(course)
    } else {
      res.send('')
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
