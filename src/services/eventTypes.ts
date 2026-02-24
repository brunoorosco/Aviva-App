import { TEventType } from '@/domain/models/eventTypes'
import { EventTypesRepository } from '@/infra/db/repositories/mongo/eventTypes'

export const getEventTypesService = async (churchId: string): Promise<TEventType[]> => {
  const eventTypesRepository = new EventTypesRepository()
  const result = await eventTypesRepository.getEventTypes(churchId)
  return result
}

export const getEventTypeByIdService = async (eventTypeId: string): Promise<TEventType | null> => {
  const eventTypesRepository = new EventTypesRepository()
  const result = await eventTypesRepository.getEventTypeById(eventTypeId)
  return result
}

export const createEventTypeService = async (data: Omit<TEventType, '_id'>): Promise<TEventType> => {
  const eventTypesRepository = new EventTypesRepository()
  const saved = await eventTypesRepository.create(data)
  return saved
}

export const updateEventTypeService = async (
  id: string,
  data: Partial<TEventType>
): Promise<boolean> => {
  const eventTypesRepository = new EventTypesRepository()
  const saved = await eventTypesRepository.update(id, data)
  return saved
}

export const deleteEventTypeService = async (id: string): Promise<boolean> => {
  const eventTypesRepository = new EventTypesRepository()
  const saved = await eventTypesRepository.delete(id)
  return saved
}
