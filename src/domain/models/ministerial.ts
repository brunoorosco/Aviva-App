import { User } from "./users";

export type TMinisterialLevel =
  | "Membro"
  | "Auxiliar"
  | "Lider"
  | "Separado a Supervisão"
  | "Supervisor"
  | "Separado a Pastorado"
  | "Pastor"
  | "Bispo";

export type Permission =
  | "USER"
  | "ADMIN_CHURCH"
  | "SUPERADMIN"
  | "boas-vindas"
  | "secretaria"
  | "ADMIN_CELL";

export type Cargo =
  | "Membro"
  | "Auxiliar"
  | "Lider"
  | "Separado a Supervisão"
  | "Supervisor"
  | "Separado a Pastorado"
  | "Pastor"
  | "Bispo";

export type TMinisterialRecord = {
  data: string; // YYYY-MM-DD
  type: TMinisterialLevel;
};

export type TMinisterialHistory = {
  _id: string;
  name: string;
  consagracao: TMinisterialRecord[];
};

export const ministerialLevels: TMinisterialLevel[] = [
  "Auxiliar",
  "Lider",
  "Separado a Supervisão",
  "Supervisor",
  "Separado a Pastorado",
  "Pastor",
];

export type TConsagracaoUser = {
  user_id: string;
  name: string;
  cell_id: string;
};

export type TConsagracao = {
  _id: string;
  consagracao_at: string; // YYYY-MM-DD
  cargo: TMinisterialLevel;
  users: TConsagracaoUser[];
};

export type TPerson = {
  _id: string;
  name: string;
  cell_id: string;
  cell_name: string;
};

// Para o propósito deste exemplo, um tipo para a lista temporária
export type TempConsagracaoUser = Pick<User, "_id" | "name" | "email" | "role"> & {
  nextRole: TMinisterialLevel;
};

export type TempUserToAdd = {
  id: string; // ID do usuário existente
  name: string;
  rede?: { _id: string; name: string } | string;
  role: TMinisterialLevel; // Cargo atual
  nextRole: TMinisterialLevel; // proximo Cargo 
};

export type ConsagracaoPayload = {
  userId: string;
  targetRole: TMinisterialLevel;
};