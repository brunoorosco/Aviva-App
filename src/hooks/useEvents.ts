import { TEvent } from '@/domain/models/events'
import { useCallback, useEffect, useState } from 'react'

export function useEvents(churchId: string) {
  const [events, setEvents] = useState<TEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    if (!churchId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/protected/churches/${churchId}/events`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar eventos')
      }
      
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }, [churchId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const createEvent = useCallback(async (eventData: Omit<TEvent, '_id'>) => {
    try {
      const response = await fetch(`/api/protected/churches/${churchId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar evento')
      }

      const newEvent = await response.json()
      setEvents(prev => [...prev, newEvent])
      return newEvent
    } catch (err) {
      console.error('Error creating event:', err)
      throw err
    }
  }, [churchId])

  const updateEvent = useCallback(async (eventId: string, eventData: Partial<TEvent>) => {
    try {
      const response = await fetch(`/api/protected/churches/${churchId}/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar evento')
      }

      setEvents(prev => prev.map(e => e._id === eventId ? { ...e, ...eventData } : e))
      await fetchEvents() // Recarrega para garantir sincronização
    } catch (err) {
      console.error('Error updating event:', err)
      throw err
    }
  }, [churchId, fetchEvents])

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      const response = await fetch(`/api/protected/churches/${churchId}/events/${eventId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar evento')
      }

      setEvents(prev => prev.filter(e => e._id !== eventId))
    } catch (err) {
      console.error('Error deleting event:', err)
      throw err
    }
  }, [churchId])

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  }
}
