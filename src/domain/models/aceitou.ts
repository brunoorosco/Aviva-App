export type AceitouModel = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  accepted: boolean;
  baptism: boolean;
  number_encontro: number
  acceptedAt: Date;
  createdAt: Date;
  rede?: {
    name: string;
    _id: string;
  };
};
