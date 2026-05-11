import { withAudit } from '@/middlewares/withAudit';
import {
  deleteEventsService,
  getEventsByIdService,
  updateEventsService
} from '@/services/events'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const eventsId = (req.query?.id as string) || ''
    if (req.method == 'PUT') {
      const event = await updateEventsService(eventsId, req.body)
      res.status(200).json({ event })
    } else if (req.method == 'GET') {
      const event = await getEventsByIdService(eventsId)
      res.send(event)
    } else if (req.method == 'DELETE') {
      const event = await deleteEventsService(eventsId)
      console.log(event)
      return res.status(204).json({ success: event })
    } else {
      res.send('')
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export default withAudit(handler);