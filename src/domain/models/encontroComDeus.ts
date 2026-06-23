type BaseEncontro = {
  _id: string;
  data: Date;
  numero: string;
  igreja: string;
  churchId: string;
  descricao?: string;
  equipe: TEquipe[];
  financeiro: FinanceiroRede[];
  allowPastEdits?: boolean;
};

export type TEncontroComDeus = BaseEncontro & {
  encontristas: People[];
};

export type TReencontroComDeus = BaseEncontro & {
  reencontristas: People[];
};

// Estrutura financeira por rede - cada rede tem seu próprio objeto
export interface FinanceiroRede {
  _id: string;
  status: StatusFinanceiro;
  rede: {
    _id: string;
    name: string;
  };
  encontrista: number;
  equipe: number;
  pagamento: PagamentoItem[];
  totalPago: number;
  totalAPagar: number;
  createdAt: string;
  updatedAt: string;
}

// Item individual de pagamento (usado dentro de FinanceiroRede)
export interface PagamentoItem {
  _id?: string;
  tipo: TypePagamento;
  valor: number;
  comprovanteUrl?: string;
  comprovanteName?: string;
  createdAt: string;
}

// ↓ Esse é o type que o componente PagamentosSection usa
// Representa um pagamento no formulário/UI (sem createdAt obrigatório)
export interface Pagamento {
  _id: string;
  tipo: TypePagamento;
  valor: number;
  data: string; // ← o componente usa p.data
  comprovanteUrl?: string;
  comprovanteName?: string;
  comprovantePublicId?: string;
}

export type TypePagamento = "pix" | "cartao" | "dinheiro";
export type StatusFinanceiro = "quitado" | "parcial" | "pendente" | "excedente";

export type TEquipe = {
  name: string;
  _id: string;
  isento: boolean;
  rede: { _id: string; name: string };
};

type People = {
  _id?: string;
  nome: string;
  rede?: { _id: string; name: string } | string;
  idade?: string;
  email?: string;
  telefone?: string;
  igreja?: string;
  endereco?: string;
  bairro?: string;
  sexo?: string;
  dataNascimento?: string;
  isento?: boolean;
  isMembro?: boolean;
  equipeMembroId?: string;
};

export type TPeople = People;
