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
    name: "Minha Rede",
    order: 1,
    link: `/app/${churchId}/redes/${cemId}/members`,
    completed: true,
  },
  {
    id: "step-2",
    name: "CEM's",
    order: 2,
    link: `/app/${churchId}/cems`,
    completed: true,
  },
  {
    id: "step-3",
    name: "Visita de Paz",
    order: 3,
    link: `/app/${churchId}/visitasdepaz`,
    completed: true,
  },
  {
    id: "step-4",
    name: "Casa de Paz",
    order: 4,
    link: `/app/${churchId}/casasdepaz`,
    completed: true,
  },
  {
    id: "step-5",
    name: "Encontro com Deus",
    order: 5,
    link: `/app/${churchId}/secretary/encontroComDeus`,
    completed: true,
  },
  {
    id: "step-6",
    name: "C.A.E",
    order: 6,
    link: `#`,
    completed: true,
  },
  {
    id: "step-7",
    name: "Batismo",
    order: 7,
    link: `/app/${churchId}/secretary/batismos`,
    completed: true,
  },
  {
    id: "step-8",
    name: "Seja Livre",
    order: 8,
    link: `/app/${churchId}/secretary/sejaLivre`,
    completed: true,
  },
  {
    id: "step-9",
    name: "Reencontro com Deus",
    order: 9,
    link: `/app/${churchId}/secretary/reencontroComDeus`,
    completed: true,
  },
  {
    id: "step-10",
    name: "Discipulado",
    order: 10,
    link: `/app/${churchId}/secretary/discipulado`,
    completed: true,
  },
  {
    id: "step-11",
    name: "Treinamento de Líderes",
    order: 11,
    link: `/app/${churchId}/secretary/escola-de-profeta`,
    completed: true,
  },
  {
    id: "step-12",
    name: "Escola de Profeta",
    order: 12,
    link: `/app/${churchId}/secretary/escola-de-profeta`,
    completed: true,
  },
];
