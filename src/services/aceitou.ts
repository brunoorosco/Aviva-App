import { AceitouRepository } from "@/infra/db/repositories/mongo/aceitou";

export const getAceitouService = async (churchId: string, page: number, limit: number) => {
  const aceitouRepository = new AceitouRepository();
  const result = await aceitouRepository.getUseusAceitou(churchId, page, limit);

  return result;
};

export const createAceitouService = async (data: any, churchId: string): Promise<any> => {
  const aceitouRepository = new AceitouRepository();

  let rede: { name: string; _id: string } | undefined = undefined;
  if (data?.cem) {
    rede = {
      name: data.cem.split("-")[1] as string,
      _id: data.cem.split("-")[0] as string,
    };
  }

  // Converte booleanos corretamente
  const hasEncontro = data.hasEncontro === true || data.hasEncontro === "true";

  // Monta objeto dinamicamente
  const dataFormatted: any = {
    acceptedAt: new Date(data.acceptedAt),
    name: data.name?.trim() as string,
    email: data.email?.trim() || null,
    phone: data.phone.replace(/[^0-9]/g, "") || null,
    rede,
    accepted: data.accepted === true || data.accepted === "true",
    baptism: data.baptism === true || data.baptism === "true",
    description: data.description?.trim() || null,
    hasEncontro,
    ...(hasEncontro && { numberEncontro: data.numberEncontro?.trim() || null }), // só adiciona se hasEncontro for true
  };

  const saved = await aceitouRepository.create(dataFormatted, churchId);
  return saved;
};

export const importAceitouService = async (data: any, churchId: string): Promise<any> => {
  const aceitouRepository = new AceitouRepository();
  const saved = await aceitouRepository.create(data, churchId);
  return saved;
};
