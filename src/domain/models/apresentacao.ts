import { ObjectId } from "mongodb";

type TBaseApresentacao = {
  _id?: string;
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

export type TCriancaItem = {
  nomeCrianca: string;
  nomePai?: string;
  nomeMae: string;
  rede: { _id: string; name: string } | string;
};

/** Curso de apresentação de crianças. Um doc "caixa" que agrupa as
 *  apresentações geradas (cada item vira um `TCrianca` na mesma collection,
 *  apontando de volta via `cursoId`).
 */
export type TCursoCrianca = TBaseApresentacao & {
  tipo: "cursoCrianca";
  dataCurso: string; // YYYY-MM-DD
  items: TCriancaItem[];
  criadoPor: { _id: string; name: string };
  cursoItems?: string[]; // ids das apresentações geradas (snapshott pra cascade)
};

export type TCrianca = TBaseApresentacao & {
  tipo: "crianca";
  nomeCrianca: string;
  nomePai?: string;
  nomeMae: string;
  cursoId?: string; // aponta pro TCursoCrianca que gerou (opcional)
};

export type TApresentacao =
  | TAlianca
  | TNovoMembro
  | TCrianca
  | TCursoCrianca;