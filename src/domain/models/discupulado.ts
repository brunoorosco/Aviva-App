export type Membro = {
  id: string;
  nome: string;
  rede: { name: string; _id: string };
};

export type AlunoPresenca = {
  membroId: string;
  nome: string;
  rede: { name: string; _id: string };
  presente: boolean;
};

export type MinistroDaAula = {
  membroId: string;
  nome: string;
  rede: { name: string; _id: string };
};

export type AulaDiscipulado = {
  id: string;
  data: string; // ISO date
  tema: string;
  ministrador: MinistroDaAula;
  cicloId?: string; // identifies the 6-month cycle
  alunos: AlunoPresenca[];
  createdAt?: string;
};

export type CicloDiscipulado = {
  id: string;
  nome: string; // e.g. "1º Semestre 2026"
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
};
