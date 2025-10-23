import { TMinisterialHistory } from "@/domain/models/ministerial";


export const mockMinisterialHistory: TMinisterialHistory[] = [
  {
    _id: "1",
    name: "João Silva",
    consagracao: [
      { data: "2021-03-20", type: "Auxiliar" },
      { data: "2022-06-10", type: "Líder" },
      { data: "2023-09-05", type: "Separado a Supervisão" },
    ],
  },
  {
    _id: "2",
    name: "Maria Santos",
    consagracao: [
      { data: "2020-08-15", type: "Auxiliar" },
      { data: "2022-01-20", type: "Líder" },
    ],
  },
];
