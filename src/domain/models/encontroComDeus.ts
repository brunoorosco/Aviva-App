type BaseEncontro = {
  _id: string;
  data: Date;
  numero: string;
  igreja: string;
  equipe: TEquipe[];
  financeiro: Pagamento;
};

export type TEncontroComDeus = BaseEncontro & {
  encontristas: People[];
};

export type TReencontroComDeus = BaseEncontro & {
  reencontristas: People[];
};

export interface Pagamento {
  _id: string;
  tipo: "pix" | "cartao" | "dinheiro";
  valor: number;
  data: string;
  comprovanteUrl?: string;
  comprovanteName?: string;
}

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
  rede?: string;
  idade?: string;
  email?: string;
  telefone?: string;
  igreja?: string;
  endereco?: string;
  bairro?: string;
  sexo?: string;
  dataNascimento?: string;
  isento?: boolean;
};

export type TPeople = People;
