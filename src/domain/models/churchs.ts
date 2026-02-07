import { ObjectId } from "mongodb";
import { AddressModel } from "./address";
import { CellsModel } from "./cells";
import { TMinisterialLevel } from "./ministerial";
import { TApresentacao } from "./apresentacao";

export type ChurchModel = {
  _id: ObjectId;
  name: string;
  consagracao: ConsagracaoHistory[];
  apresentacao: TApresentacao[];
  cells: CellsModel[];
} & AddressModel;

export type ConsagracaoHistory = {
  _id: string;
  date: Date;
  totalConsagrated: number;
  rolesConsagrated: {
    count: number;
    role: string;
    //[key in TMinisterialLevel]?: { name: string; id: string; total: number };
  }[];
};
