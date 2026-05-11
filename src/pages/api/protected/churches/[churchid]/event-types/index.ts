import { withAudit } from '@/middlewares/withAudit';
import { createEventTypeService, getEventTypesService } from '@/services/eventTypes'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const churchId = (req.query?.churchid as string) || ''
    
    if (req.method === 'POST') {
      const eventType = await createEventTypeService(req.body)
      res.status(201).json(eventType)
    } else if (req.method === 'GET') {
      const eventTypes = await getEventTypesService(churchId)
      res.status(200).json(eventTypes)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in event-types API:', error)
    res.status(500).json({ message: 'Internal server error', error: String(error) })
  }
}

export default withAudit(handler);