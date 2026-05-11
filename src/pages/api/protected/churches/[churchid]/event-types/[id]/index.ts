import { withAudit } from '@/middlewares/withAudit';
import {
  deleteEventTypeService,
  getEventTypeByIdService,
  updateEventTypeService
} from '@/services/eventTypes'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const eventTypeId = (req.query?.id as string) || ''
    
    if (req.method === 'PUT') {
      const success = await updateEventTypeService(eventTypeId, req.body)
      res.status(200).json({ success })
    } else if (req.method === 'GET') {
      const eventType = await getEventTypeByIdService(eventTypeId)
      res.status(200).json(eventType)
    } else if (req.method === 'DELETE') {
      const success = await deleteEventTypeService(eventTypeId)
      res.status(200).json({ success })
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in event-type API:', error)
    res.status(500).json({ message: 'Internal server error', error: String(error) })
  }
}

export default withAudit(handler);