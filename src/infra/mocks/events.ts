import { TEvent } from "@/domain/models/events";


export const mockEvents: TEvent[] = [
  {
    _id: "1",
    titulo: "Reunião de Equipe",
    data: "2025-10-15",
    diaInteiro: false,
    horaInicio: "09:00",
    horaFim: "11:00",
    descricao: "Planejamento trimestral",
  },
  {
    _id: "2",
    titulo: "Workshop de Capacitação",
    data: "2025-10-20",
    diaInteiro: true,
    descricao: "Workshop completo sobre novas metodologias",
  },
  {
    _id: "3",
    titulo: "Apresentação de Resultados",
    data: "2025-10-22",
    diaInteiro: false,
    horaInicio: "14:00",
    horaFim: "16:30",
  },
  {
    _id: "4",
    titulo: "Conferência Anual",
    data: "2025-10-25",
    diaInteiro: true,
    descricao: "Evento anual da organização",
  },
  {
    _id: "5",
    titulo: "Treinamento Técnico",
    data: "2025-10-28",
    diaInteiro: false,
    horaInicio: "10:00",
    horaFim: "12:00",
  },
];
