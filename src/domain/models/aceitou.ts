export type AceitouModel = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  accepted: boolean;
  baptism: boolean;
  numberEncontro: number
  hasEncontro: boolean
  acceptedAt: Date;
  createdAt: Date;
  rede?: {
    name: string;
    _id: string;
  };
};
