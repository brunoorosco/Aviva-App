export interface TProcessStep {
  id: string;
  name: string;
  order: number;
  link: string;
  completed?: boolean;
}

export interface TProcess {
  id: string;
  title: string;
  steps: TProcessStep[];
}
export const stepsProcess = ({
  churchId,
  cemId,
}: {
  churchId: string;
  cemId: string;
}): TProcessStep[] => [
  {
    id: "step-1",
    name: "CEM's",
    order: 1,
    link: `/app/${churchId}/cems/${cemId}/members`,
    completed: true,
  },
  {
    id: "step-2",
    name: "Visita de Paz",
    order: 2,
    link: `/app/${churchId}/visitasdepaz`,
    completed: true,
  },
  {
    id: "step-3",
    name: "Casa de Paz",
    order: 3,
    link: `/app/${churchId}/casasdepaz`,
    completed: true,
  },
  {
    id: "step-4",
    name: "Encontro com Deus",
    order: 4,
    link: `/app/${churchId}/secretary/encontroComDeus`,
    completed: true,
  },
  {
    id: "step-5",
    name: "C.A.E",
    order: 5,
    link: `#`,
    completed: true,
  },
  {
    id: "step-6",
    name: "Batismo",
    order: 6,
    link: `/app/${churchId}/secretary/batismos`,
    completed: true,
  },
  {
    id: "step-7",
    name: "Seja Livre",
    order: 7,
    link: `/app/${churchId}/secretary/sejaLivre`,
    completed: true,
  },
  {
    id: "step-8",
    name: "Reencontro com Deus",
    order: 8,
    link: `/app/${churchId}/secretary/reencontroComDeus`,
    completed: true,
  },
  {
    id: "step-9",
    name: "Discipulado",
    order: 9,
    link: `/app/${churchId}/secretary/discipulado`,
    completed: true,
  },
  {
    id: "step-10",
    name: "Treinamento de Líderes",
    order: 10,
    link: `/app/${churchId}/secretary/escola-de-profeta`,
    completed: true,
  },
  {
    id: "step-11",
    name: "Escola de Profeta",
    order: 11,
    link: `/app/${churchId}/secretary/escola-de-profeta`,
    completed: true,
  },
];
