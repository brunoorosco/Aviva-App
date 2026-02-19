import { useState } from 'react'
import {
  format,
  startOfYear,
  endOfYear,
  eachWeekendOfInterval,
  addDays,
  subDays,
  isSameDay,
  addYears,
  subYears
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TEvent } from '@/domain/models/events'
import { Button } from '@/components/ui/button'

const parseDateNoTimezone = (date: string) => {
  if (!date) return new Date()
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day, 12) // 12h evita shift de timezone
}

interface WeekendCalendarProps {
  events: TEvent[]
}

const WeekendCalendarPage = ({ events: mockEvents }: WeekendCalendarProps) => {
  const [currentYear, setCurrentYear] = useState(new Date())
  const [events, setEvents] = useState<TEvent[]>([])
  const yearStart = startOfYear(currentYear)
  const yearEnd = endOfYear(currentYear)

  // Pega todos os finais de semana do ano (sábados e domingos)
  const weekends = eachWeekendOfInterval({ start: yearStart, end: yearEnd })

  // Agrupa os finais de semana em blocos de sexta-sábado-domingo
  const weekendBlocks = weekends.reduce((blocks: Date[][], weekend) => {
    if (weekend.getDay() === 6) {
      const friday = subDays(weekend, 1)
      const saturday = weekend
      blocks.push([friday, saturday])
    }
    if (weekend.getDay() === 0 && blocks.length > 0) {
      blocks[blocks.length - 1].push(weekend)
    }
    return blocks
  }, [])

  // Verifica se um evento ocorre em um dia específico ou dentro do intervalo
  const isEventOnDay = (event: TEvent, day: Date) => {
    const eventStart = parseDateNoTimezone(event.data)
    const eventEnd = event.dataFim
      ? parseDateNoTimezone(event.dataFim)
      : undefined
    if (eventEnd) return day >= eventStart && day <= eventEnd
    return isSameDay(eventStart, day)
  }

  // Pega todos os eventos que ocorrem em um dia específico
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isEventOnDay(event, day))
  }

  // Pega eventos para um bloco de final de semana
  const getEventsForWeekend = (weekendDays: Date[]) => {
    return events.filter((event) =>
      weekendDays.some((day) => isEventOnDay(event, day))
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-foreground'>
            Calendário de Finais de Semana
          </h1>
          <p className='text-muted-foreground'>
            Visualize eventos nos finais de semana (Sexta, Sábado e Domingo)
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6'>
          {/* Weekend Calendar Section */}
          <div className='w-full'>
            <div className='bg-card rounded-lg border shadow-sm p-6'>
              {/* Calendar Header */}
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-semibold'>
                  {format(currentYear, 'yyyy')}
                </h2>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setCurrentYear(subYears(currentYear, 1))}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setCurrentYear(addYears(currentYear, 1))}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              {/* Weekend Blocks Grid */}
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-3'>
                {weekendBlocks.map((weekendDays, idx) => {
                  const weekendEvents = getEventsForWeekend(weekendDays)
                  const [friday, saturday, sunday] = weekendDays
                  const hasCurrentDay = weekendDays.some((day) =>
                    isSameDay(day, new Date())
                  )

                  return (
                    <div
                      key={idx}
                      className={cn(
                        'border rounded-lg p-3 hover:bg-accent transition-colors aspect-square flex flex-col',
                        hasCurrentDay && 'ring-2 ring-primary'
                      )}
                    >
                      <div className='text-xs font-semibold text-primary mb-1'>
                        FS {idx + 1}
                      </div>
                      <div className='text-xs text-muted-foreground mb-2'>
                        {format(friday, 'dd/MM')} - {format(sunday, 'dd/MM')}
                      </div>

                      {/* Days with Event Colors */}
                      <div className='flex-1 flex gap-1 flex-col'>
                        {[friday, saturday, sunday].map((day) => {
                          const dayEvents = getEventsForDay(day)
                          return (
                            <div key={day.toString()} className='flex gap-1 items-center'>
                              <span className='text-xs font-medium w-6'>
                                {format(day, 'EEE', { locale: ptBR }).charAt(0).toUpperCase()}
                              </span>
                              <div className='flex-1 flex gap-0.5'>
                                {dayEvents.length > 0 ? (
                                  dayEvents.slice(0, 3).map((event) => (
                                    <div
                                      key={event._id}
                                      className='flex-1 h-4 rounded'
                                      style={{ 
                                        backgroundColor: event.cor || '#3b82f6',
                                        minWidth: '8px'
                                      }}
                                      title={event.titulo}
                                    />
                                  ))
                                ) : (
                                  <div className='flex-1 h-4 bg-muted/30 rounded' />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {weekendEvents.length > 0 && (
                        <div className='text-xs text-muted-foreground mt-1 text-center'>
                          {weekendEvents.length} evento{weekendEvents.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeekendCalendarPage
