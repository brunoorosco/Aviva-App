import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventModal } from "@/components/Calendar/EventModal";
import { DayDrawer } from "@/components/Calendar/DayDrawer";
import { useRouter } from "next/router";
import { useEvents } from "@/hooks/useEvents";
import { useEventTypes } from "@/hooks/useEventTypes";
import { TEvent } from "@/domain/models/events";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Calendario() {
  const router = useRouter();
  const { churchid } = router.query;
  const churchId = churchid as string;
  
  const { events, loading: loadingEvents, createEvent, updateEvent, deleteEvent } = useEvents(churchId);
  const { eventTypes, loading: loadingTypes } = useEventTypes(churchId);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TEvent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const loading = loadingEvents || loadingTypes;

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getEventsForDay = (date: Date): TEvent[] => {
    return events.filter((ev) => {
      const start = parseISO(ev.dataInicio || ev.data);
      const end = parseISO(ev.dataFim || ev.data);
      return (
        isWithinInterval(date, { start, end }) || isSameDay(date, start) || isSameDay(date, end)
      );
    });
  };

  const getEventTypeColor = (eventTypeId: string) => {
    return eventTypes.find(t => t.id === eventTypeId)?.color || "#cccccc";
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDrawerOpen(true);
  };

  const handleEditEvent = async (eventId: string, data: Partial<TEvent>) => {
    try {
      await updateEvent(eventId, data);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleSaveEvent = async (eventData: Omit<TEvent, '_id'>) => {
    try {
      await createEvent(eventData);
      setModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      setDrawerOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const today = new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-[Montserrat] text-foreground">Calendário</h1>
          <Button onClick={handleNewEvent} className="gap-2" disabled={eventTypes.length === 0}>
            <Plus className="h-4 w-4" /> Novo Evento
          </Button>
        </div>

        {/* Legend */}
        {/* {eventTypes.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {eventTypes.map((tipo) => (
              <div key={tipo.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: tipo.color }}
                />
                <span>{tipo.label}</span>
              </div>
            ))}
          </div>
        )}
        
        {eventTypes.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Nenhum tipo de evento cadastrado. Configure os tipos de eventos em{" "}
              <a href={`/app/${churchId}/admin/eventos`} className="underline font-semibold">
                Configurações de Eventos
              </a>.
            </p>
          </div>
        )} */}

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4 bg-card rounded-lg p-3 border border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-lg font-semibold capitalize text-foreground">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 bg-secondary">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, i) => {
              const dayEvents = getEventsForDay(date);
              const inMonth = isSameMonth(date, currentMonth);
              const isToday = isSameDay(date, today);

              return (
                <button
                  key={i}
                  onClick={() => handleDayClick(date)}
                  className={`
                    relative aspect-square border-t border-r border-border p-1 transition-all
                    hover:ring-1 hover:ring-primary/50 hover:z-10 cursor-pointer
                    ${!inMonth ? "opacity-30" : ""}
                    ${isToday ? "ring-2 ring-primary z-10" : ""}
                  `}
                  style={
                    dayEvents.length === 1
                      ? { backgroundColor: `${getEventTypeColor(dayEvents[0].eventTypeId)}99` }
                      : dayEvents.length >= 2
                        ? {
                            background: `linear-gradient(135deg, ${getEventTypeColor(dayEvents[0].eventTypeId)}99 50%, ${getEventTypeColor(dayEvents[1].eventTypeId)}99 50%)`,
                          }
                        : { backgroundColor: "transparent" }
                  }
                >
                  <span
                    className={`
                      text-xs font-medium
                      ${isToday ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center" : "text-foreground"}
                      ${dayEvents.length > 0 ? "font-bold" : ""}
                    `}
                  >
                    {format(date, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="absolute bottom-1 left-0.5 right-0.5 text-[13px] leading-tight font-semibold text-foreground line-clamp-2 break-words">
                      {dayEvents.map((e) => e.titulo).join(" · ")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        event={editingEvent}
        onSave={handleSaveEvent}
        eventTypes={eventTypes}
        churchId={churchId}
      />

      <DayDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        date={selectedDate}
        events={selectedDate ? getEventsForDay(selectedDate) : []}
        eventTypes={eventTypes}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
