import { TAnnualVisitor, TMonthlyVisitor, TVisitorBySource } from "@/domain/models/visitantes";

export const mockMonthlyVisitors: TMonthlyVisitor[] = [
  { month: "Jan", count: 145 },
  { month: "Fev", count: 178 },
  { month: "Mar", count: 203 },
  { month: "Abr", count: 189 },
  { month: "Mai", count: 221 },
  { month: "Jun", count: 267 },
  { month: "Jul", count: 312 },
  { month: "Ago", count: 298 },
  { month: "Set", count: 276 },
  { month: "Out", count: 245 },
  { month: "Nov", count: 223 },
  { month: "Dez", count: 198 },
];

export const mockAnnualVisitors: TAnnualVisitor[] = [
  { year: "2021", count: 1876 },
  { year: "2022", count: 2234 },
  { year: "2023", count: 2567 },
  { year: "2024", count: 2789 },
  { year: "2025", count: 2955 },
];

export const mockVisitorsBySource: TVisitorBySource[] = [
  { source: "invinted", count: 856 },
  { source: "instagram", count: 723 },
  { source: "facebook", count: 612 },
  { source: "youtube", count: 445 },
  { source: "outros", count: 319 },
];
