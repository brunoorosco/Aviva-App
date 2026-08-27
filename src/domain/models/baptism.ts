export type baptism = {
  _id: string;
  data: Date;
  churchId: string;
  batizandos: People[];
  local?: string | string[];
};

type People = {
  nome: string;
  rede?: string;
  isCourse: boolean;
  sexo?: string;
  userId?: string;
};
