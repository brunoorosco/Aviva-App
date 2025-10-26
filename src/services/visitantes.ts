import { VisitantesRepository } from "@/infra/db/repositories/mongo/visitantes";

export const createVisitantesService = async (data: any, churchId: string): Promise<any> => {
  const visitantesRepository = new VisitantesRepository();
  let rede: { name: string; _id: string } | undefined = undefined;
  if (data?.cem) {
    rede = {
      name: data.cem.split("-")[1] as string,
      _id: data.cem.split("-")[0] as string,
    };
  }

  const dataFormatted = {
    visitedAt: new Date(data.visitedAt),
    name: data.name?.trim() as string,
    email: data.email?.trim() || null,
    phone: data.phone.replace(/[^0-9]/g, "") || null,
    rede,
    description: data.description?.trim() || null,
  };

  const saved = await visitantesRepository.create(dataFormatted, churchId);
  return saved;
};

export const getVisitantesService = async (churchId: string) => {
  const aceitouRepository = new VisitantesRepository();
  const result = await aceitouRepository.getVisitantes(churchId);

  return result;
};