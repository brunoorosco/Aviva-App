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
  cor?: string // Cor do evento em hexadecimal (ex: #FF5733)
}
