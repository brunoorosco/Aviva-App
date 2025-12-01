export type TAlianca = {
  _id: string;
  nomeHomem: string;
  nomeMulher: string;
  rede: string;
  dataApresentacao: string;
};

export type TNovoMembro = {
  _id: string;
  nome: string;
  rede: string;
  dataApresentacao: string;
};

export type TCrianca = {
  _id: string;
  nomeCrianca: string;
  nomePai: string;
  nomeMae: string;
  rede: string;
  dataApresentacao: string;
};
