import { AddressModel } from "./address";
import { Cargo, Permission, TMinisterialLevel } from "./ministerial";

export type User = {
  _id: string;
  churchId: string;
  cem: Cem;
  name: string;
  email: string;
  phone: string;
  image?: string;
  active: boolean;
  birthDate: string;
  address?: AddressModel;
  permission: Permission[];
  role: Cargo;
  password: string;
  createdAt: string;
  updatedAt: string;
  encontroComDeus?: boolean;
  reencontroComDeus?: boolean;
  sejaLivre?: boolean;
  batizado?: boolean;
  discipulado?: boolean;
  cae?: boolean;
  escolaProfeta?: boolean;
  historicoEscolaProfeta?: Historico[];
  consagracao?: Consagracao[];
  ministerios?: TMinisterioUser[];
};

export type TMinisterioUser = {
  _id: string;
  name: string;
  cargo: string;
};

type Historico = {
  curso_id: string;
  cursoName: string;
  status: "APROVADO" | "REPROVADO";
};

type Cem = {
  _id: string;
  name: string;
};

type Consagracao = {
  data: string;
  ministerialLevel: TMinisterialLevel;
};
