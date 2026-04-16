export interface RelatorioFinanceiroEncontro {
  _id: string;
  numero: string;
  data: string;
}

export interface PagamentoResumo {
  _id: string;
  tipo: string;
  valor: number;
  data: string;
  comprovanteUrl?: string;
  comprovanteName?: string;
}

export interface RelatorioFinanceiroGrupo {
  id: string;
  nome: string;
  celula: string;
  encontristas: number;
  encontristasIsentos: number;
  equipe: number;
  equipeIsentos: number;
  totalPago: number;
  totalAPagar: number;
  status: "quitado" | "parcial" | "pendente" | "excedente";
  pagamentosPorTipo: Record<string, number>;
  pagamentos?: PagamentoResumo[];
}

export interface RelatorioFinanceiroTotais {
  totalEncontristas: number;
  totalReencontristas: number;
  totalEquipe: number;
  totalParticipantes: number;
  totalIsentos: number;
  totalPago: number;
  totalAPagar: number;
  pagamentosPorTipoGeral: Record<string, number>;
}

export interface RelatorioFinanceiroData {
  encontro: RelatorioFinanceiroEncontro;
  reencontro: RelatorioFinanceiroEncontro;
  grupos: RelatorioFinanceiroGrupo[];
  totais: RelatorioFinanceiroTotais;
}