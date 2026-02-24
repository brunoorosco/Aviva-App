export type EventType = 'encontro' | 'retiro' | 'formacao' | 'reuniao' | 'celebracao' | 'outro';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  encontro: 'Encontro',
  retiro: 'Retiro',
  formacao: 'Formação',
  reuniao: 'Reunião',
  celebracao: 'Celebração',
  outro: 'Outro',
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  encontro: '24 95% 53%',      // orange (primary)
  retiro: '142 71% 45%',       // green
  formacao: '217 91% 60%',     // blue
  reuniao: '280 65% 60%',      // purple
  celebracao: '45 93% 58%',    // yellow (accent)
  outro: '0 84% 60%',          // red (destructive)
};

export interface CalendarEvent {
  id: string;
  titulo: string;
  tipo: EventType;
  dataInicio: string; // YYYY-MM-DD
  dataFim: string;    // YYYY-MM-DD
  descricao?: string;
}
