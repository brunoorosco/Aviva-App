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

// Mobile: abreviação de 1 letra | Desktop: 3 letras
const WEEKDAYS = [
  { short: "D", long: "Dom" },
  { short: "S", long: "Seg" },
  { short: "T", long: "Ter" },
  { short: "Q", long: "Qua" },
  { short: "Q", long: "Qui" },
  { short: "S", long: "Sex" },
  { short: "S", long: "Sáb" },
];

export default function Calendario() {
  const router = useRouter();
  const { churchid } = router.query;
  const churchId = churchid as string;

  const {
    events,
    loading: loadingEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents(churchId);
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

  const getEventsForDay = (date: Date): TEvent[] =>
    events.filter((ev) => {
      const start = parseISO(ev.dataInicio || ev.data);
      const end = parseISO(ev.dataFim || ev.data);
      return (
        isWithinInterval(date, { start, end }) || isSameDay(date, start) || isSameDay(date, end)
      );
    });

  const getEventTypeColor = (eventTypeId: string) =>
    eventTypes.find((t) => t.id === eventTypeId)?.color || "#cccccc";

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDrawerOpen(true);
  };

  const handleSaveEvent = async (eventData: Omit<TEvent, "_id">) => {
    try {
      await createEvent(eventData);
      setModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = async (eventId: string, data: Partial<TEvent>) => {
    try {
      await updateEvent(eventId, data);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const today = new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col mt-6">
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 py-4 md:px-4 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-xl font-bold font-[Montserrat] text-foreground md:text-2xl">
            Calendário
          </h1>
          <Button
            onClick={() => {
              setEditingEvent(null);
              setModalOpen(true);
            }}
            className="gap-1 h-8 px-3 text-sm md:h-10 md:px-4 md:text-base"
            disabled={eventTypes.length === 0}
          >
            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Novo Evento</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>

        {/* Legenda dos tipos — scroll horizontal no mobile */}
        {eventTypes.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
            {eventTypes.map((tipo) => (
              <div
                key={tipo.id}
                className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap"
              >
                <div
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: tipo.color }}
                />
                <span>{tipo.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navegação do mês */}
        <div className="flex items-center justify-between mb-3 bg-card rounded-lg px-2 py-2 border border-border md:p-3 md:mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-9 md:w-9"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <span className="text-base font-semibold capitalize text-foreground md:text-lg">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-9 md:w-9"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>

        {/* Grid do calendário */}
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 bg-secondary">
            {WEEKDAYS.map((wd, i) => (
              <div
                key={i}
                className="py-1.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider md:py-2"
              >
                <span className="sm:hidden">{wd.short}</span>
                <span className="hidden sm:inline">{wd.long}</span>
              </div>
            ))}
          </div>

          {/* Células dos dias */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, i) => {
              const dayEvents = getEventsForDay(date);
              const inMonth = isSameMonth(date, currentMonth);
              const isToday = isSameDay(date, today);
              const hasEvents = dayEvents.length > 0;
              const color1 = hasEvents ? getEventTypeColor(dayEvents[0].eventTypeId) : null;
              const color2 =
                dayEvents.length >= 2 ? getEventTypeColor(dayEvents[1].eventTypeId) : null;

              return (
                <button
                  key={i}
                  onClick={() => handleDayClick(date)}
                  className={`
                    relative aspect-square border-t border-r border-border
                    transition-all overflow-hidden cursor-pointer
                    hover:ring-1 hover:ring-primary/50 hover:z-10
                    ${!inMonth ? "opacity-30" : ""}
                    ${isToday ? "ring-2 ring-primary z-10" : ""}
                  `}
                >
                  {/* ── Fundos coloridos ── */}
                  {!color2 && color1 && (
                    <div className="absolute inset-0" style={{ backgroundColor: `${color1}99` }} />
                  )}
                  {color2 && (
                    <>
                      <div
                        className="absolute inset-x-0 top-0 bottom-1/2"
                        style={{ backgroundColor: `${color1}99` }}
                      />
                      <div
                        className="absolute inset-x-0 top-1/2 bottom-0"
                        style={{ backgroundColor: `${color2}99` }}
                      />
                    </>
                  )}

                  {/* ── Número do dia ── */}
                  <div className="relative z-10 flex items-start justify-start p-0.5 md:p-1">
                    <span
                      className={`
                      text-[10px] font-semibold leading-none md:text-xs
                      ${
                        isToday
                          ? "bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center md:w-6 md:h-6"
                          : "text-foreground"
                      }
                    `}
                    >
                      {format(date, "d")}
                    </span>
                  </div>

                  {/* ── Títulos mobile: bolinhas coloridas ── */}
                  {hasEvents && (
                    <div className="sm:hidden absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
                      {dayEvents.slice(0, 3).map((ev, idx) => (
                        <span
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getEventTypeColor(ev.eventTypeId) }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] leading-none text-foreground/60">+</span>
                      )}
                    </div>
                  )}

                  {/* ── Títulos desktop: texto em cada seção ── */}
                  {dayEvents.length === 1 && (
                    <span className="hidden sm:block absolute z-10 bottom-1 left-0.5 right-0.5 text-[11px] leading-tight font-semibold line-clamp-2 break-words">
                      {dayEvents[0].titulo}
                    </span>
                  )}

                  {dayEvents.length >= 2 && (
                    <>
                      <span className="hidden sm:block absolute z-10 top-4 left-0.5 right-0.5 text-[10px] leading-tight font-semibold line-clamp-1">
                        {dayEvents[0].titulo}
                      </span>
                      <span className="hidden sm:block absolute z-10 bottom-1 left-0.5 right-0.5 text-[10px] leading-tight font-semibold line-clamp-1">
                        {dayEvents[1].titulo}
                      </span>
                      {dayEvents.length > 2 && (
                        <span className="hidden sm:block absolute z-10 bottom-1 right-0.5 text-[9px] font-bold text-foreground/60">
                          +{dayEvents.length - 2}
                        </span>
                      )}
                    </>
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
