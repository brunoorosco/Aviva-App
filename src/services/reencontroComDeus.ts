import { TPeople } from "@/domain/models/encontroComDeus";
import { ChurChMongoRepository } from "../infra/db/repositories/mongo/churchs";
import { ReencontroComDeusRepository } from "../infra/db/repositories/mongo/reencontroComDeus";

export const getReencontroComDeusService = async (churchId: string) => {
  const encontroRepository = new ReencontroComDeusRepository();
  const result = await encontroRepository.getReencontroComDeus(churchId);

  return result;
};
export const getReencontroComDeusByIdService = async (churchId: string, encontroId: string) => {
  const encontroRepository = new ReencontroComDeusRepository();
  const result = await encontroRepository.getReencontroComDeusById(encontroId);

  return result;
};

export const createReencontroComDeusService = async (data: any): Promise<any> => {
  const encontroRepository = new ReencontroComDeusRepository();
  const churchRepository = new ChurChMongoRepository();
  const churchs = await churchRepository.getChurch();
  const dataNormalizada = normalizarEncontristasPorIgreja(data, "Avivamento Sede");
  const reencontro = {
    data: new Date(),
    encontristas: data,
  };
  const saved = await encontroRepository.create(reencontro);
  return saved;
};

export const createReencontroComDeusImportedService = async (
  data: (string | TPeople)[]
): Promise<any> => {
  const encontroRepository = new ReencontroComDeusRepository();
  // Removido: churchs não utilizado
  const reencontristas = normalizarEncontristasPorIgreja(data, "Avivamento Sede");

  const novoReencontro = {
    data: new Date(),
    reencontristas,
  };
  return encontroRepository.create(novoReencontro);
};

function limparObjeto<T extends Record<string, any>>(obj: T): Partial<T> {
  const novo: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== "" && value !== null) {
      // @ts-expect-error atribuição dinâmica
      novo[key] = value;
    }
  }
  return novo;
}

const normalizar = (s?: string) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function normalizarEncontristasPorIgreja(
  entradas: (string | TPeople)[],
  nomeDaIgreja: string
): TPeople[] {
  const termos = ["igreja", "avivamento"];

  return entradas.map((entrada) => {
    if (typeof entrada === "string") {
      const eNorm = normalizar(entrada);
      const contemIgreja = termos.some((t) => eNorm.includes(t));

      const out = {
        // nome vazio será removido por limparObjeto
        nome: undefined,
        igreja: contemIgreja ? entrada : nomeDaIgreja,
        rede: contemIgreja ? undefined : entrada,
      };
      //@ts-ignore
      return limparObjeto(out) as TPeople;
    }

    const redeNorm = normalizar(entrada.rede);
    const contemIgreja = termos.some((t) => redeNorm.includes(t));

    const endereco = [entrada.endereco, entrada.bairro].filter(Boolean).join(" ") || undefined;

    const out = {
      nome: entrada.nome.trim(),
      idade: entrada.idade,
      dataNascimento: entrada.dataNascimento,
      telefone: entrada.telefone,
      endereco,
      igreja: contemIgreja ? (entrada.rede as string) : nomeDaIgreja,
      rede: contemIgreja ? undefined : entrada.rede,
    };

    return limparObjeto(out) as TPeople;
  });
}
