import { VisitantesRepository } from "@/infra/db/repositories/mongo/visitantes";

export const createVisitantesService = async (data: any, churchId: string): Promise<any> => {
  const visitantesRepository = new VisitantesRepository();

  // Monta a rede se existir
  let rede: { name: string; _id: string } | undefined = undefined;
  if (data?.cem) {
    rede = {
      name: data.cem.split("-")[1] as string,
      _id: data.cem.split("-")[0] as string,
    };
  }

  // Monta o objeto final
  const dataFormatted: any = {
    visitedAt: new Date(data.visitedAt),
    name: data.name?.trim(),
    phone: data.phone?.replace(/[^0-9]/g, "") || null,
    description: data.description?.trim() || null,
    region: data.region?.trim() || null,
    howHeard: data.howHeard || null,
  };

  // Só inclui invitedBy se howHeard for "invited"
  if (data.howHeard === "invited") {
    dataFormatted.invitedBy = data.invitedBy?.trim() || null;
  }

  const saved = await visitantesRepository.create(dataFormatted, churchId);
  return saved;
};

export const getVisitantesService = async (churchId: string) => {
  const aceitouRepository = new VisitantesRepository();
  const result = await aceitouRepository.getVisitantes(churchId);

  return result;
};
