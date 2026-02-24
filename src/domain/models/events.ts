export type TEvent = {
  _id?: string
  titulo: string
  data: string // YYYY-MM-DD
  dataInicio?: string
  dataFim?: string
  diaInteiro: boolean
  horaInicio?: string // HH:MM
  horaFim?: string // HH:MM
  descricao?: string
  churchId: string
  eventTypeId: string // Referência ao tipo de evento (event_types collection)
  cor?: string // Cor do evento em hexadecimal (ex: #FF5733) - deprecated, usar eventType.color
}
