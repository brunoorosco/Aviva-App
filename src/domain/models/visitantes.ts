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

export type TVisitorSource = "invited" | "instagram" | "facebook" | "youtube" | "outros";

export type TMonthlyVisitor = {
  monthYear: string;
  totalItems: number;
};

export type TVisitorBySource = {
  source: TVisitorSource;
  count: number;
};

export type TVisitorCountResponse = {
  monthly: TMonthlyVisitor[];
  visitorsToday: number;
  bySource: TVisitorBySource[];
};

export enum TVisitor {
  invited = "Convidado",
  instagram = "Instagram",
  facebook = "Facebook",
  youtube = "Youtube",
  other = "Outros",
}
