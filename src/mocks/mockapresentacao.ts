import { TAlianca, TNovoMembro, TCrianca } from "@/domain/models/apresentacao";

export const mockAliancas: TAlianca[] = [
  {
    _id: "1",
    nomeHomem: "Carlos Silva",
    nomeMulher: "Juliana Silva",
    dataApresentacao: "2024-01-15",
    rede: "Simeão",
  },
  {
    _id: "2",
    nomeHomem: "Roberto Santos",
    nomeMulher: "Mariana Santos",
    dataApresentacao: "2024-02-20",
    rede: "Simeão",
  },
];

export const mockNovosMembros: TNovoMembro[] = [
  {
    _id: "1",
    nome: "João Pedro",
    rede: "Rede Alfa",
    dataApresentacao: "2024-03-10",
  },
  {
    _id: "2",
    nome: "Maria Clara",
    rede: "Rede Beta",
    dataApresentacao: "2024-03-15",
  },
  {
    _id: "3",
    nome: "Lucas Oliveira",
    rede: "Rede Gama",
    dataApresentacao: "2024-04-01",
  },
];

export const mockCriancas: TCrianca[] = [
  {
    _id: "1",
    nomeCrianca: "Ana Beatriz",
    nomePai: "Paulo Costa",
    nomeMae: "Fernanda Costa",
    dataApresentacao: "2024-02-05",
    rede: "Simeão",
  },
  {
    _id: "2",
    nomeCrianca: "Gabriel Souza",
    nomePai: "Marcos Souza",
    nomeMae: "Patricia Souza",
    dataApresentacao: "2024-03-20",
    rede: "Simeão",
  },
];
