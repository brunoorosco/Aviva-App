import { AceitouRepository } from "@/infra/db/repositories/mongo/aceitou";

export const getAceitouService = async (churchId: string) => {
  const aceitouRepository = new AceitouRepository();
  const result = await aceitouRepository.getUseusAceitou(churchId);

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

  const dataFormatted = {
    acceptedAt: new Date(data.acceptedAt),
    name: data.name?.trim() as string,
    email: data.email?.trim() || null,
    phone: data.phone.replace(/[^0-9]/g, "") || null,
    rede,
    accepted: data.accepted === "true",
    baptism: data.baptism === "true",
    description: data.description?.trim() || null,
  };

  const saved = await aceitouRepository.create(dataFormatted, churchId);
  return saved;
};

export const importAceitouService = async (data: any, churchId: string): Promise<any> => {
  const aceitouRepository = new AceitouRepository();
  const saved = await aceitouRepository.create(data, churchId);
  return saved;
};
