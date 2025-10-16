export type TMinisterialLevel =
  | "Auxiliar"
  | "Líder"
  | "Separado a Supervisão"
  | "Supervisor"
  | "Separado a Pastorado"
  | "Pastor";

export type Permission =
  | "USER"
  | "ADMIN_CHURCH"
  | "SUPERADMIN"
  | "SECRETARIA"
  | "SUPERVISOR"
  | "ADMIN_CELL";

export type Cargo =
  | "MEMBRO"
  | "DISCIPÚLO"
  | "AUXILIAR"
  | "LÍDER"
  | "SUPERVISOR"
  | "PASTOR"
  | "BISPO";

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
  "Líder",
  "Separado a Supervisão",
  "Supervisor",
  "Separado a Pastorado",
  "Pastor",
];
