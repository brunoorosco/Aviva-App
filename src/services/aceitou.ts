import { AceitouRepository } from "@/infra/db/repositories/mongo/aceitou";

export const getAceitouService = async (churchId: string) => {
  const aceitouRepository = new AceitouRepository();
  const result = await aceitouRepository.getUseusAceitou(churchId);

  return result;
};

export const createAceitouService = async (data: any, churchId: string): Promise<any> => {
  const aceitouRepository = new AceitouRepository();
  const saved = await aceitouRepository.create(data);
  return saved;
};

export const importAceitouService = async (data: any): Promise<any> => {
  const aceitouRepository = new AceitouRepository();
  const saved = await aceitouRepository.create(data);
  return saved;
};
