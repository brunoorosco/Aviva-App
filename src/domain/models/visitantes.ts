export type VisitantesModel = {
  _id: string;
  name: string;
  phone?: string;
  visitedAt: Date;
  createdAt: Date;
  howHeard?: string;
  invitedBy?: string;
  region?: string;
};
