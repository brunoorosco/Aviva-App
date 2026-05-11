import { withAudit } from '@/middlewares/withAudit';
import {
createSejaLivreService,
getSejaLivreService
} from '@/services/sejaLivre'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const churchId = (req.query?.churchid as string) || ''
    if (req.method == 'POST') {
      const user = await createSejaLivreService(req.body)
      res.status(201).json({ user })
    } else if (req.method == 'GET') {
      const batismo = await getSejaLivreService(churchId)
      res.send(batismo)
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