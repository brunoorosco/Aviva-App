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
  ministerioId: string,
  data: any,
): Promise<any> => {
  const ministerioRepository = new MinisterioMongoRepository();
  const nameMinisterio = capitalizeWords(data.name);

  // Busca o ministério atual para comparar
  const ministerioAtual = await ministerioRepository.getMinisterioById(churchId, ministerioId);
  
  const updateData = {
    name: nameMinisterio,
    lideres: data.lideres,
    membros: data.membros,
    description: data.description,
  };

  // Atualiza o ministério
  const saved = await ministerioRepository.update(churchId, ministerioId, updateData);

  // Sincroniza líderes
  if (data.lideres) {
    await syncMinisterioMembers(
      ministerioRepository,
      ministerioAtual?.lideres || [],
      data.lideres,
      ministerioId,
      nameMinisterio,
      "lider"
    );
  }

  // Sincroniza membros
  if (data.membros) {
    await syncMinisterioMembers(
      ministerioRepository,
      ministerioAtual?.membros || [],
      data.membros,
      ministerioId,
      nameMinisterio,
      "membro"
    );
  }

  return saved;
};

/**
 * Sincroniza membros/líderes do ministério
 * - Adiciona novos membros
 * - Remove membros que foram retirados
 */
async function syncMinisterioMembers(
  repository: MinisterioMongoRepository,
  membrosAntigos: { _id: string; name: string }[],
  membrosNovos: { _id: string; name: string }[],
  ministerioId: string,
  ministerioName: string,
  cargo: "lider" | "membro"
) {
  const idsAntigos = membrosAntigos.map(m => m._id.toString());
  const idsNovos = membrosNovos.map(m => m._id.toString());

  // Encontra membros para adicionar (estão nos novos mas não nos antigos)
  const paraAdicionar = membrosNovos.filter(m => !idsAntigos.includes(m._id.toString()));
  
  // Encontra membros para remover (estão nos antigos mas não nos novos)
  const paraRemover = membrosAntigos.filter(m => !idsNovos.includes(m._id.toString()));

  // Adiciona novos membros
  for (const membro of paraAdicionar) {
    try {
      await repository.updateUserMinisterios(
        membro._id,
        {
          _id: ministerioId,
          name: ministerioName,
          cargo: cargo,
        },
        "add"
      );
    } catch (error) {
      // Ignora erro se já existe
      console.log(`Membro ${membro.name} já possui o ministério`);
    }
  }

  // Remove membros antigos
  for (const membro of paraRemover) {
    await repository.updateUserMinisterios(
      membro._id,
      {
        _id: ministerioId,
        name: ministerioName,
        cargo: cargo,
      },
      "remove"
    );
  }
}

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
