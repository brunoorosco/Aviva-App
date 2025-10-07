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
  ChevronRight,
  Calendar as CalendarIcon
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

  // Pega eventos para um bloco de final de semana
  const getEventsForWeekend = (weekendDays: Date[]) => {
    return events.filter((event) =>
      weekendDays.some((day) => isEventOnDay(event, day))
    )
  }

  const yearEvents =
    events?.filter((event) => {
      if (!event?.data) return false
      const eventDate = parseDateNoTimezone(event.data)
      return eventDate.getFullYear() === currentYear.getFullYear()
    }) || []

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

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Weekend Calendar Section */}
          <div className='lg:col-span-3'>
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
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3'>
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

                      {/* Events List */}
                      <div className='flex-1 space-y-1 overflow-hidden'>
                        {weekendEvents.length > 0 ? (
                          weekendEvents.slice(0, 3).map((event) => (
                            <div
                              key={event._id}
                              className='text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded truncate'
                              title={event.titulo}
                            >
                              {event.titulo}
                            </div>
                          ))
                        ) : (
                          <div className='text-xs text-muted-foreground/50'>
                            Sem eventos
                          </div>
                        )}
                        {weekendEvents.length > 3 && (
                          <div className='text-xs text-muted-foreground'>
                            +{weekendEvents.length - 3} mais
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Events List Section */}
          <div className='lg:col-span-1'>
            <div className='bg-card rounded-lg border shadow-sm p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-xl font-semibold'>Eventos do Ano</h3>
                <span className='text-sm text-muted-foreground'>
                  {yearEvents.length} eventos
                </span>
              </div>

              <div className='space-y-3 max-h-[600px] overflow-y-auto'>
                {yearEvents.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground'>
                    <CalendarIcon className='h-12 w-12 mx-auto mb-2 opacity-50' />
                    <p>Nenhum evento este ano</p>
                  </div>
                ) : (
                  yearEvents
                    .sort(
                      (a, b) =>
                        parseDateNoTimezone(a.data).getTime() -
                        parseDateNoTimezone(b.data).getTime()
                    )
                    .map((event) => (
                      <div
                        key={event._id}
                        className='p-3 border rounded-lg hover:bg-accent transition-colors'
                      >
                        <div className='flex items-start justify-between gap-2 mb-1'>
                          <h4 className='font-medium text-sm'>
                            {event.titulo}
                          </h4>
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {format(
                            parseDateNoTimezone(event.data),
                            'dd/MM/yyyy'
                          )}
                          {event.dataFim &&
                            ` - ${format(
                              parseDateNoTimezone(event.dataFim),
                              'dd/MM/yyyy'
                            )}`}
                        </div>
                        {event.descricao && (
                          <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>
                            {event.descricao}
                          </p>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeekendCalendarPage
