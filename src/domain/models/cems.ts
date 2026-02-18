export type CemsModel = {
  _id: string;
  data_inicial: string;
  casas: TCems[];
  church_id: string;
};

export type TCems = {
  _id: string;
  lider1: { _id: string; name: string } | null;
  lider2: { _id: string; name: string } | null;
  endereco: string;
  rede?: { _id: string; name: string } | string;
  anfitria?: string;
  telefone?: string;
};
