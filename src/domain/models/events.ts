export type TEvent = {
  _id: string;
  titulo: string;
  data: string; // YYYY-MM-DD
  diaInteiro: boolean;
  horaInicio?: string; // HH:MM
  horaFim?: string; // HH:MM
  descricao?: string;
};
