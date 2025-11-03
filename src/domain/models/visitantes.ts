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

export type TVisitorSource = "invinted" | "instagram" | "facebook" | "youtube" | "outros";

export type TMonthlyVisitor = {
  month: string;
  count: number;
};

export type TAnnualVisitor = {
  year: string;
  count: number;
};

export type TVisitorBySource = {
  source: TVisitorSource;
  count: number;
};
