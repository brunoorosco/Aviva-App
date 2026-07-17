import type { TPeople } from "./encontroComDeus";

// Reutiliza tipos do encontroComDeus
export type { TypePagamento, StatusFinanceiro, TEquipe } from "./encontroComDeus";
export type { PagamentoItem, Pagamento, FinanceiroRede } from "./encontroComDeus";

export type TConferencia = {
  _id: string;
  data: Date | string;
  numero?: string;
  descricao?: string;
  local?: string;
  churchId: string;
  participantes: TParticipante[];
  equipe: TEquipeConferencia[];
  financeiro: TFinanceiroRedeConferencia[];
  allowPastEdits?: boolean;
};

export type TParticipante = TPeople;

export type TEquipeConferencia = {
  name: string;
  _id: string;
  isento: boolean;
  rede: { _id: string; name: string };
};

export interface TFinanceiroRedeConferencia {
  _id: string;
  status: "quitado" | "parcial" | "pendente" | "excedente";
  rede: {
    _id: string;
    name: string;
  };
  participante: number;
  equipe: number;
  pagamento: TPagamentoItemConferencia[];
  totalPago: number;
  totalAPagar: number;
  createdAt: string;
  updatedAt: string;
}

export interface TPagamentoItemConferencia {
  _id?: string;
  tipo: "pix" | "cartao" | "dinheiro";
  valor: number;
  comprovanteUrl?: string;
  comprovanteName?: string;
  createdAt: string;
}
