
type TBaseApresentacao = {
  _id: string;
  rede?: { _id: string; name: string } | string;
  dataApresentacao: string;
  horario: 'manha' | 'noite';
};

export type TAlianca = TBaseApresentacao & {
  tipo: "alianca";
  nomeHomem: string;
  nomeMulher: string;
};

export type TNovoMembro = TBaseApresentacao & {
  tipo: "novoMembro";
  nome: string;
  igreja_anterior?: string;
};

export type TCrianca = TBaseApresentacao & {
  tipo: "crianca";
  nomeCrianca: string;
  nomePai: string;
  nomeMae: string;
};

export type TApresentacao =
  | TAlianca
  | TNovoMembro
  | TCrianca;
