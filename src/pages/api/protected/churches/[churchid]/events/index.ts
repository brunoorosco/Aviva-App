
import { createEventsService, getEventsService } from '@/services/events'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || ''
    if (req.method == 'POST') {
      const events = await createEventsService(req.body)
      res.status(201).json(events)
    } else if (req.method == 'GET') {
      const events = await getEventsService(churchId)
      res.send(events)
    } else {
      res.send('')
    }
  } catch (error) {
    throw new Error(error as string)
  }
}
