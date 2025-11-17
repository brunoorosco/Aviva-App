import { TMinisterialLevel } from "@/domain/models/ministerial";
import { ConsagracaoRepository } from "@/infra/db/repositories/mongo/consagracao";

const consagracaoRepository = new ConsagracaoRepository();

export const getConsagracaoByChurchIdService = async (churchId: string) => {
  const result = await consagracaoRepository.getConsagracaoByChurch(churchId);
  return result;
};
export const getConsagracaoByIdService = async (churchId: string, casaDePazId: string) => {
  const result = await consagracaoRepository.getConsagracaoById(churchId, casaDePazId);

  return result;
};

export const createConsagracaoService = async (churchId: string, date: Date): Promise<any> => {
  const response = await consagracaoRepository.createConsagracao(churchId, date);
  return response;
};

export const addConsagratedService = async (
  churchId: string,
  consagracaoId: string,
  users: { name: string; id: string; rede: string; role: TMinisterialLevel; nextRole: TMinisterialLevel }[] // se existir, faz update/add
) => {
  if (!consagracaoId || !churchId) {
    throw new Error("Informação Faltando");
  }
  const nextRole = users[0].nextRole
  return consagracaoRepository.addCargo(churchId, consagracaoId, nextRole , users);
};
