"use client";

import { useRouter } from "next/navigation";

const IndexApp = () => {
  const router = useRouter();

  // Lista de etapas — cada uma pode levar para uma rota diferente
  const steps = [
    { label: "CEMs", path: "./cems" },
    { label: "Visita de Paz", path: "/saas/visita-de-paz" },
    { label: "Casa de Paz", path: "/saas/casa-de-paz" },
    { label: "Encontro com Deus", path: "/saas/encontro-com-deus" },
    { label: "C.A.E.", path: "/saas/cae" },
    { label: "Batismo", path: "/saas/batismo" },
    { label: "Seja Livre", path: "/saas/seja-livre" },
    { label: "Reencontro com Deus", path: "/saas/reencontro" },
    { label: "Discipulado", path: "/saas/discipulado" },
    { label: "Escola de Profeta", path: "/saas/escola-de-profeta" },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Metade de cima */}
      <div className="flex flex-col justify-center items-center h-1/2 bg-background px-4 sm:px-8">
        {/* <div className="w-full max-w-6xl">
          <img
            src="/path-to-image.jpg"
            alt="Visão"
            className="w-full h-64 object-cover rounded-lg shadow"
          />
        </div> */}
        <img src="/logo-preto.png" width="60%" className="mx-auto my-16" />
      </div>

      {/* Metade de baixo */}
      {/* <div className="flex flex-col justify-center items-center h-1/2 bg-white border-t px-4 sm:px-8">
        <div className="w-full max-w-6xl">
          <StepProgressBar
            steps={steps.map((step) => ({
              label: step.label,
              ok: true,
              onClick: () => router.push(step.path),
            }))}
          />
        </div>
      </div> */}
    </div>
  );
};

export default IndexApp;
