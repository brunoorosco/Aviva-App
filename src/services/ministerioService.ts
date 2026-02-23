import { capitalizeWords } from "@/utils/capitalizaFirst";
import { MinisterioMongoRepository } from "../infra/db/repositories/mongo/ministerio";

export const createMinisterioService = async (data: any, churchesId: string): Promise<any> => {
  const ministerioRepository = new MinisterioMongoRepository();
  const nameMinisterio = capitalizeWords(data.name);

  const newCell = {
    name: nameMinisterio,
    lideres: data.lideres,
    membros: data.membros,
  };

  const saved = await ministerioRepository.create(churchesId, newCell);

  if (data.lideres)
    data.lideres.forEach((lider: { _id: string; name: string }) => {
      ministerioRepository.updateUserMinisterios(
        lider._id,
        {
          _id: saved._id,
          name: nameMinisterio,
          cargo: "lider",
        },
        "add",
      );
    });

  if (data.membros)
    data.membros.forEach((membro: { _id: string; name: string }) => {
      ministerioRepository.updateUserMinisterios(
        membro._id,
        {
          _id: saved._id,
          name: nameMinisterio,
          cargo: "membro",
        },
        "add",
      );
    });

  return saved;
};

export const updateMinisterioService = async (
  churchId: string,
  cemId: string,
  data: any,
): Promise<any> => {
  const ministerioRepository = new MinisterioMongoRepository();
  const updateCell = {
    name: data.name.toUpperCase(),
    number: data.number,
    cep: data.zipcode ? data.zipcode.replace("-", "") : "",
    city: data.city ?? data.city,
    street: data.street ?? data.street,
    state: data.state ?? data.state,
    description: data.description,
  };
  const saved = await ministerioRepository.update(churchId, cemId, updateCell);
  return saved;
};

export const getMinisterioService = async (churchid: string) => {
  const ministerioRepository = new MinisterioMongoRepository();
  const result = await ministerioRepository.getMinisterios(churchid);

  return result;
};

export const getMinisterioByIdService = async (churchid: string, cemId: string) => {
  const ministerioRepository = new MinisterioMongoRepository();
  const result = await ministerioRepository.getMinisterioById(churchid, cemId);
  return result;
};

export const deleteMinisterioService = async (churchId: string, cemId: string) => {
  const ministerioRepository = new MinisterioMongoRepository();
  const result = await ministerioRepository.delete(churchId, cemId);
  return result;
};
