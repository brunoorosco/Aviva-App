import { TCems } from "@/domain/models/cems";
import { CemsRepository } from "@/infra/db/repositories/mongo/cems";
import { ObjectId } from "mongodb";

const cemsRepository = new CemsRepository();

export const getCemsService = async (churchId: string) => {
  const result = await cemsRepository.getCems(churchId);

  return result;
};

export const getCemsByIdService = async (churchId: string, casaDePazId: string) => {
  const result = await cemsRepository.getCemsById(casaDePazId);

  return result;
};

export const createCemsService = async (
  churchId: string,
  data: { casas: TCems[]; data_inicial: string },
): Promise<any> => {
  const casaMap = data.casas.map((casa) => {
    return { ...casa, _id: new ObjectId() };
  });

  const response = await cemsRepository.createCems({
    church_id: churchId,
    data_inicial: data.data_inicial,
    casas: casaMap,
  });
  return response;
};

export const saveCemsService = async (params: {
  visitaId?: string; // se existir, faz update/add
  church_id: string;
  dataInicial?: string;
  casa: TCems;
}) => {
  const { visitaId, casa } = params;
  if (!visitaId) {
    throw new Error("Data inicial é obrigatória para nova visita");
  }
  if (casa._id) {
    // Edita casa existente
    const resp = cemsRepository.updateCasa(visitaId, casa);
    console.log("casa :>> ", resp);
    return resp;
  }

  // Adiciona nova casa em documento existente
  const resp = cemsRepository.addCasa(visitaId, casa);
  return resp;
};

export const deleteCasaCemsService = async (params: {
  churchId?: string; // se existir, faz update/add
  casaId: string;
  cemId?: string;
}) => {
  const { churchId, casaId, cemId } = params;

  if (!casaId || !cemId) {
    throw new Error("CasaId e CemId é obrigatória para nova visita");
  }
  const resp = cemsRepository.deleteCasaCems(cemId, casaId);
  return resp;
};

export const deleteCemsByIdService = async (params: {
  churchId?: string; // se existir, faz update/add
  cemId?: string;
}) => {
  const { churchId, cemId } = params;

  if (!cemId) {
    throw new Error("CemId é obrigatória para nova visita");
  }
  const resp = cemsRepository.deleteCemById(cemId);
  console.log("casa :>> ", resp);
  return resp;
};
