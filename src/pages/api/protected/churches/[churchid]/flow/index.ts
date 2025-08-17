// pages/api/church/[id]/flow.ts
import { FlowMongoRepository } from '@/infra/db/repositories/mongo/flow'
import { FlowService } from '@/services/flowService'
import { NextApiRequest, NextApiResponse } from 'next'

const repo = new FlowMongoRepository()
const service = new FlowService(repo)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { churchid } = req.query

  if (typeof churchid !== 'string')
    return res.status(400).json({ error: 'Invalid churchId' })

  if (req.method === 'POST') {
    try {
      const data = req.body
      const reactFlowData = await service.saveChurchFlow(churchid, data)
      res.status(200).json({ reactFlowData })
    } catch (err: any) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  } else if (req.method === 'GET') {
    try {
      const flow = await repo.getFlow(churchid)
      res.status(200).json({ flow })
    } catch (err: any) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  } else {
    res.status(405).end()
  }
}
