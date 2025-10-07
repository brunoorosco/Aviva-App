import { EventsRepository } from '@/infra/db/repositories/mongo/eventos'

export const getEventsService = async (churchId: string) => {
  const eventsRepository = new EventsRepository()
  const result = await eventsRepository.getEvents(churchId)

  return result
}
export const getEventsByIdService = async (eventId: string) => {
  const eventsRepository = new EventsRepository()
  const result = await eventsRepository.getEventById(eventId)

  return result
}

export const createEventsService = async (data: any): Promise<any> => {
  const eventsRepository = new EventsRepository()
  const saved = await eventsRepository.create(data)
  return saved
}

export const updateEventsService = async (
  id: string,
  data: any
): Promise<any> => {
  const eventsRepository = new EventsRepository()
  const saved = await eventsRepository.update(id, data)
  return saved
}

export const deleteEventsService = async (id: string): Promise<any> => {
  const eventsRepository = new EventsRepository()
  const saved = await eventsRepository.delete(id)
  return saved
}
