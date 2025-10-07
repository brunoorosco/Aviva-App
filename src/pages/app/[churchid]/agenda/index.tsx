import { useState, useMemo, useEffect } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { TEvent } from '@/domain/models/events'
import { useHttpDelete, useHttpGet, useHttpPost } from '@/hooks/api'
import { useSession } from 'next-auth/react'
import { parseDateNoTimezone } from '@/utils/date'

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<TEvent | null>(null)

  // Form state
  const [titulo, setTitulo] = useState('')
  const [diaInteiro, setDiaInteiro] = useState(false)
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFim, setHoraFim] = useState('')
  const [descricao, setDescricao] = useState('')
  const [dataFim, setDataFim] = useState<Date | null>(null)
  const [events, setEvents] = useState<TEvent[]>([])
  const { data: session } = useSession()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { locale: ptBR })
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR })
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  const baseURl = `/api/protected/churches/${session?.user.churchId}/events`

  const { data: eventsData, isLoading } = useHttpGet<{
    data: TEvent[]
  }>(baseURl)

  useEffect(() => {
    if (eventsData?.data) {
      const arr = Array.isArray(eventsData.data)
        ? eventsData.data
        : eventsData.data.data ?? []
      setEvents(arr)
    }
  }, [eventsData])

  const monthEvents = useMemo(() => {
    if (!Array.isArray(events)) return []
    return events.filter((event) =>
      isSameMonth(new Date(`${event.data}T12:00:00`), currentDate)
    )
  }, [events, currentDate])

  const getEventsForDay = (day: Date) => {
    if (!Array.isArray(events)) return []
    return events.filter((event) =>
      isSameDay(new Date(`${event.data}T12:00:00`), day)
    )
  }

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
    setEditingEvent(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleEventClick = (event: TEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDate(new Date(event.data))
    setEditingEvent(event)
    setTitulo(event.titulo)
    setDiaInteiro(event.diaInteiro)
    setHoraInicio(event.horaInicio || '')
    setHoraFim(event.horaFim || '')
    setDescricao(event.descricao || '')
    setDataFim(event.dataFim ? new Date(event.dataFim) : null)
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setTitulo('')
    setDiaInteiro(false)
    setHoraInicio('')
    setHoraFim('')
    setDescricao('')
    setDataFim(null)
  }

  const handleSaveEvent = async () => {
    if (!titulo.trim() || !selectedDate) return

    const eventData: TEvent = {
      _id: editingEvent?._id,
      titulo: titulo.trim(),
      data: format(selectedDate, 'yyyy-MM-dd'),
      dataFim: dataFim ? format(dataFim, 'yyyy-MM-dd') : undefined,
      diaInteiro,
      horaInicio: diaInteiro ? undefined : horaInicio,
      horaFim: diaInteiro ? undefined : horaFim,
      descricao: descricao.trim() || undefined,
      churchId: session?.user.churchId as string
    }

    const resp = await useHttpPost<TEvent>({
      url: baseURl,
      data: eventData
    })
    if (resp) {
      setEvents((prev) => [...prev, resp]) // atualiza lista local
    }
    setIsModalOpen(false)
    resetForm()
  }

  const handleDeleteEvent = () => {
    if (editingEvent) {
      try {
        useHttpDelete({ url: `${baseURl}/${editingEvent._id}` })
        setEvents((prev) => prev.filter((e) => e._id !== editingEvent._id))
        resetForm()
      } catch (error) {
        console.error(error)
      } finally {
        setIsModalOpen(false)
      }
    }
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  // 💡 LOADING UI
  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex flex-col items-center justify-center'>
        <Loader2 className='h-10 w-10 text-primary animate-spin mb-3' />
        <p className='text-muted-foreground text-sm'>
          Carregando eventos, aguarde...
        </p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-foreground'>
            Calendário de Eventos
          </h1>
          <p className='text-muted-foreground'>Eventos e compromissos</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Calendar Section */}
          <div className='lg:col-span-2'>
            <div className='bg-card rounded-lg border shadow-sm p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-semibold capitalize'>
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='grid grid-cols-7 gap-2'>
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className='text-center text-sm font-medium text-muted-foreground py-2'
                  >
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, idx) => {
                  const dayEvents = getEventsForDay(day)
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isToday = isSameDay(day, new Date())

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        'relative min-h-24 px-2 py-6 flex flex-col rounded-lg border transition-colors text-left hover:bg-accent/40',
                        isCurrentMonth ? 'bg-card' : 'bg-muted/30',
                        isToday && 'ring-2 ring-primary'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 left-1 text-xs font-semibold',
                          !isCurrentMonth && 'text-muted-foreground'
                        )}
                      >
                        {format(day, 'd')}
                      </span>

                      <div className='mt-5 space-y-1'>
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event._id}
                            onClick={(e) => handleEventClick(event, e)}
                            className='text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded truncate hover:bg-primary/20 cursor-pointer'
                          >
                            {event.titulo}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className='text-xs text-muted-foreground px-1.5'>
                            +{dayEvents.length - 2} mais
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className='lg:col-span-1'>
            <div className='bg-card rounded-lg border shadow-sm p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-xl font-semibold'>Eventos do Mês</h3>
                <span className='text-sm text-muted-foreground'>
                  {monthEvents.length} eventos
                </span>
              </div>

              <div className='space-y-3 max-h-[600px] overflow-y-auto'>
                {monthEvents.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground'>
                    <CalendarIcon className='h-12 w-12 mx-auto mb-2 opacity-50' />
                    <p>Nenhum evento neste mês</p>
                  </div>
                ) : (
                  monthEvents
                    .sort(
                      (a, b) =>
                        new Date(`${a.data}T12:00:00`).getTime() -
                        new Date(`${b.data}T12:00:00`).getTime()
                    )
                    .map((event) => {
                      const startDate = new Date(`${event.data}T12:00:00`)
                      const endDate = event.dataFim
                        ? new Date(`${event.dataFim}T12:00:00`)
                        : null

                      return (
                        <div
                          key={event._id}
                          onClick={(e) => handleEventClick(event, e)}
                          className='p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors'
                        >
                          <div className='flex items-start justify-between gap-2 mb-1'>
                            <h4 className='font-medium text-sm'>
                              {event.titulo}
                            </h4>
                            <span className='text-xs text-muted-foreground whitespace-nowrap'>
                              {endDate
                                ? `${format(startDate, 'dd/MM')} a ${format(
                                    endDate,
                                    'dd/MM'
                                  )}`
                                : format(startDate, 'dd/MM')}
                            </span>
                          </div>
                          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <Clock className='h-3 w-3' />
                            {event.diaInteiro ? (
                              event.dataFim ? (
                                <span>
                                  {format(
                                    parseDateNoTimezone(event.data),
                                    'dd/MM'
                                  )}{' '}
                                  a{' '}
                                  {format(
                                    parseDateNoTimezone(event.dataFim),
                                    'dd/MM'
                                  )}
                                </span>
                              ) : (
                                <span>Dia inteiro</span>
                              )
                            ) : event.dataFim ? (
                              <span>
                                {event.horaInicio} - {event.horaFim} (
                                {format(
                                  parseDateNoTimezone(event.data),
                                  'dd/MM'
                                )}{' '}
                                a{' '}
                                {format(
                                  parseDateNoTimezone(event.dataFim),
                                  'dd/MM'
                                )}
                                )
                              </span>
                            ) : (
                              <span>
                                {event.horaInicio} - {event.horaFim}
                              </span>
                            )}
                          </div>
                          {event.descricao && (
                            <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>
                              {event.descricao}
                            </p>
                          )}
                        </div>
                      )
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Editar Evento' : 'Novo Evento'}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='titulo'>Título do Evento *</Label>
              <Input
                id='titulo'
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder='Digite o título'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Data Início</Label>
                <div className='text-sm text-muted-foreground'>
                  {selectedDate &&
                    format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR
                    })}
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dataFim'>Data Fim (Opcional)</Label>
                <Input
                  id='dataFim'
                  type='date'
                  value={dataFim ? format(dataFim, 'yyyy-MM-dd') : ''}
                  onChange={(e) =>
                    setDataFim(
                      e.target.value
                        ? new Date(`${e.target.value}T12:00:00`)
                        : null
                    )
                  }
                  min={
                    selectedDate
                      ? format(selectedDate, 'yyyy-MM-dd')
                      : undefined
                  }
                />
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='diaInteiro'
                checked={diaInteiro}
                onCheckedChange={(checked) => setDiaInteiro(!!checked)}
              />
              <Label htmlFor='diaInteiro' className='cursor-pointer'>
                Evento o dia inteiro
              </Label>
            </div>

            {!diaInteiro && (
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='horaInicio'>Hora Início</Label>
                  <Input
                    id='horaInicio'
                    type='time'
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='horaFim'>Hora Fim</Label>
                  <Input
                    id='horaFim'
                    type='time'
                    value={horaFim}
                    onChange={(e) => setHoraFim(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='descricao'>Descrição</Label>
              <Textarea
                id='descricao'
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder='Adicione detalhes sobre o evento'
                rows={3}
              />
            </div>
          </div>

          <div className='flex justify-between gap-2'>
            <div>
              {editingEvent && (
                <Button variant='destructive' onClick={handleDeleteEvent}>
                  Excluir
                </Button>
              )}
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEvent} disabled={!titulo.trim()}>
                <Plus className='h-4 w-4 mr-2' />
                {editingEvent ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CalendarPage
