import { AddressModel } from "./address";

export type CellsModel = {
  _id: string;
  name: string;
  membersActive?: number;
  description?: string;
} & AddressModel;
