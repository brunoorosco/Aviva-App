export type Membro = {
  id: string;
  nome: string;
  rede: { name: string; _id: string };
  dataEnvioQRCode?: string;
  qrCodeUrl?: string;
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
  inscritos?: Membro[];
};

export type StatusAluno = "aprovado" | "reprovado";

export type AlunoRelatorio = {
  membroId: string;
  nome: string;
  rede: { name: string; _id: string };
  totalAulas: number;
  presencas: number;
  faltas: number;
  frequencia: number; // 0-100
  status: StatusAluno;
};

export type AulaRelatorio = {
  id: string;
  data: string;
  tema: string;
  ministrador: MinistroDaAula;
  presentes: number;
  ausentes: number;
};

export type RedeRelatorio = {
  rede: string;
  total: number;
  aprovados: number;
  reprovados: number;
};

export type RelatorioCiclo = {
  ciclo: {
    id: string;
    nome: string;
    dataInicio: string;
    dataFim: string;
    ativo: boolean;
  };
  totalAulas: number;
  totalMatriculados: number;
  aprovados: number;
  reprovados: number;
  percentualAprovacao: number; // 0-100
  presencaMedia: number; // 0-100
  aulas: AulaRelatorio[];
  alunos: AlunoRelatorio[];
  porRede: RedeRelatorio[];
};
