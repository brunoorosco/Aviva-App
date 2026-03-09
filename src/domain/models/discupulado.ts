export type Membro = {
  id: string;
  nome: string;
  celula: string;
};

export type AlunoPresenca = {
  membroId: string;
  nome: string;
  celula: string;
  presente: boolean;
};

export type AulaDiscipulado = {
  id: string;
  data: string; // ISO date
  tema: string;
  ministrador: string;
  cicloId: string; // identifies the 6-month cycle
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
