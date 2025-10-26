export type VisitantesModel = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  visitedAt: Date;
  createdAt: Date;
  rede?: {
    name: string;
    _id: string;
  };
};
