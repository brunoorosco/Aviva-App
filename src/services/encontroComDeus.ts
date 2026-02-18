import { TEquipe, TPeople } from "@/domain/models/encontroComDeus";
import { ChurChMongoRepository } from "../infra/db/repositories/mongo/churchs";
import { EncontroComDeusRepository } from "../infra/db/repositories/mongo/encontroComDeus";

export const getEncontroComDeusService = async (churchId: string) => {
  const encontroRepository = new EncontroComDeusRepository();
  const result = await encontroRepository.getEncontroComDeus(churchId);
  return result;
};
export const getEncontroComDeusByIdService = async (churchId: string, encontroId: string) => {
  const encontroRepository = new EncontroComDeusRepository();
  const result = await encontroRepository.getEncontroComDeusById(encontroId);

  return result;
};

export const createEncontroComDeusService = async (data: any): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();
  const churchRepository = new ChurChMongoRepository();
  const churchs = await churchRepository.getChurch();

  const dataNormalizada = normalizarEncontristasPorIgreja(data.encontristas, "Avivamento Sede");
  const novoEncontro = {
    data: new Date(data.data),
    encontristas: data.encontristas,
    numero: data.numero,
  };
  const saved = await encontroRepository.create(novoEncontro);
  return saved;
};

export const importEncontroComDeusService = async (data: any): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();
  const churchRepository = new ChurChMongoRepository();
  const churchs = await churchRepository.getChurch();

  const dataNormalizada = normalizarEncontristasPorIgreja(data, "Avivamento Sede");
  const novoEncontro = {
    data: new Date(),
    encontristas: dataNormalizada,
  };
  const saved = await encontroRepository.create(novoEncontro);
  return saved;
};

function limparObjeto<T extends Record<string, any>>(obj: T): Partial<T> {
  const novo: Partial<T> = {};
  for (const [key, value] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
    if (value !== undefined && value !== "" && value !== null) {
      novo[key] = value;
    }
  }
  return novo;
}
const getRedeName = (rede?: { _id: string; name: string } | string): string => {
  if (!rede) return "";
  if (typeof rede === "string") return rede;
  return rede.name || "";
};

function normalizarEncontristasPorIgreja(
  entradas: (string | TPeople)[],
  nomeDaIgreja: string,
): TPeople[] {
  return entradas.map((entrada) => {
    if (typeof entrada === "string") {
      const contemIgreja = entrada.toLowerCase().includes("igreja");

      return {
        nome: "",
        igreja: contemIgreja ? entrada : nomeDaIgreja,
        ...(contemIgreja ? {} : { rede: entrada }),
      };
    }

    const contemIgreja = getRedeName(entrada.rede).toLowerCase().includes("igreja");

    const obj = {
      nome: entrada.nome,
      idade: entrada.idade,
      nasciemento: entrada.dataNascimento,
      telefone: entrada.telefone,
      endereco: entrada.endereco ? `${entrada.endereco} ${entrada.bairro}`.trim() : null,
      igreja: contemIgreja ? entrada.rede! : nomeDaIgreja,
      ...(contemIgreja ? {} : { rede: entrada.rede }),
    };

    return limparObjeto(obj) as TPeople;
  });
}

// ==================== SERVIÇOS FINANCEIROS SIMPLIFICADOS ====================

// Valores padrão
const VALOR_ENCONTRISTA = 200;
const VALOR_EQUIPE = 100;

// Calcula o status financeiro
const calculateStatus = (totalAPagar: number, totalPago: number): string => {
  if (totalPago === 0) return "pendente";
  if (totalPago >= totalAPagar) return totalPago > totalAPagar ? "excedente" : "quitado";
  return "parcial";
};

// Serviço para criar/atualizar inscrição de uma rede (apenas quantidades)
export const upsertInscricaoRedeService = async (data: {
  encontroId: string;
  rede: { _id: string; name: string };
  encontristas: TPeople[];
  equipeMembers: TEquipe[];
  pagamento: any[];
}): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();

  // Calcula quantidades baseado nos arrays
  const qtdEncontristas = data.encontristas?.length || 0;
  const qtdEquipe = data.equipeMembers?.length || 0;
  let totalPago = 0;
  let status = "pendente";

  const totalAPagar = qtdEncontristas * VALOR_ENCONTRISTA + qtdEquipe * VALOR_EQUIPE;

  if (data.pagamento.length > 0) {
    totalPago = (data?.pagamento || []).reduce((sum: number, p: any) => sum + (p.valor || 0), 0);
    status = calculateStatus(totalAPagar, totalPago);
  }

  const inscricaoData = {
    rede: data.rede,
    encontrista: qtdEncontristas,
    equipe: qtdEquipe,
    pagamento: data.pagamento || [],
    totalAPagar,
    totalPago,
    status,
  };

  // 1. Atualiza financeiro
  await encontroRepository.upsertInscricaoRede(data.encontroId, data.rede._id, inscricaoData);

  const encont = data.encontristas.map((e) => {
    return { ...e, rede: data.rede };
  });
  // 2. Remove encontristas antigos da rede e adiciona novos
  await encontroRepository.replaceEncontristasPorRede(data.encontroId, data.rede._id, encont);

  // 3. Remove equipe antiga da rede e adiciona nova
  await encontroRepository.replaceEquipePorRede(data.encontroId, data.rede._id, data.equipeMembers);

  return { success: true };
};

// Atualizar apenas quantidades
export const updateQuantidadesService = async (data: {
  encontroId: string;
  redeId: string;
  encontrista: number;
  equipe: number;
}): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();
  const result = await encontroRepository.updateQuantidades(
    data.encontroId,
    data.redeId,
    data.encontrista,
    data.equipe,
  );
  return result;
};

// Adicionar pagamento
export const addPagamentoService = async (data: {
  encontroId: string;
  redeId: string;
  pagamento: any;
}): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();
  const result = await encontroRepository.addPagamento(
    data.encontroId,
    data.redeId,
    data.pagamento,
  );
  return result;
};

// Remover pagamento
export const removePagamentoService = async (data: {
  encontroId: string;
  redeId: string;
  pagamentoId: string;
}): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();
  const result = await encontroRepository.removePagamento(
    data.encontroId,
    data.redeId,
    data.pagamentoId,
  );
  return result;
};

// Buscar inscrição de uma rede específica com dados completos
export const getInscricaoByRedeService = async (
  encontroId: string,
  redeId: string,
): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();

  // Buscar o encontro completo
  const encontro = await encontroRepository.getEncontroComDeusById(encontroId);

  if (!encontro) {
    throw new Error("Encontro não encontrado");
  }

  // Buscar a inscrição financeira desta rede
  const inscricaoFinanceira = encontro.financeiro?.find((f: any) => f.rede._id === redeId);

  // Filtrar encontristas desta rede
  const encontristas = encontro.encontristas?.filter((e: any) => e.rede === redeId) || [];

  // Filtrar equipe desta rede
  const equipe = encontro.equipe?.filter((e: any) => e.rede?._id === redeId) || [];

  // Retornar dados completos
  return {
    financeiro: inscricaoFinanceira || null,
    encontristas,
    equipe,
    encontro: {
      _id: encontro._id,
      numero: encontro.numero,
      data: encontro.data,
    },
  };
};

// Buscar todas as inscrições
export const getAllInscricoesService = async (encontroId: string): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();
  const result = await encontroRepository.getAllInscricoes(encontroId);
  return result;
};
