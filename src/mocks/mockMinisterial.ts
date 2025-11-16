import { TConsagracao, TMinisterialHistory, TPerson } from "@/domain/models/ministerial";

export const mockMinisterialHistory: TMinisterialHistory[] = [
  {
    _id: "1",
    name: "João Silva",
    consagracao: [
      { data: "2021-03-20", type: "Auxiliar" },
      { data: "2022-06-10", type: "Lider" },
      { data: "2023-09-05", type: "Separado a Supervisão" },
    ],
  },
  {
    _id: "2",
    name: "Maria Santos",
    consagracao: [
      { data: "2020-08-15", type: "Auxiliar" },
      { data: "2022-01-20", type: "Lider" },
    ],
  },
];

export const mockConsagracoes: TConsagracao[] = [
  {
    _id: "1",
    consagracao_at: "2024-01-15",
    cargo: "Auxiliar",
    users: [
      { user_id: "1", name: "João Silva", cell_id: "cell1" },
      { user_id: "2", name: "Maria Santos", cell_id: "cell2" },
    ],
  },
  {
    _id: "2",
    consagracao_at: "2024-06-10",
    cargo: "Lider",
    users: [{ user_id: "3", name: "Pedro Costa", cell_id: "cell1" }],
  },
];

export const mockPeople: TPerson[] = [
  { _id: "1", name: "João Silva", cell_id: "cell1", cell_name: "Célula Alpha" },
  { _id: "2", name: "Maria Santos", cell_id: "cell2", cell_name: "Célula Beta" },
  { _id: "3", name: "Pedro Costa", cell_id: "cell1", cell_name: "Célula Alpha" },
  { _id: "4", name: "Ana Paula", cell_id: "cell3", cell_name: "Célula Gama" },
  { _id: "5", name: "Carlos Oliveira", cell_id: "cell2", cell_name: "Célula Beta" },
  { _id: "6", name: "Juliana Souza", cell_id: "cell3", cell_name: "Célula Gama" },
];
