import { TEquipe, TPeople } from "@/domain/models/encontroComDeus";
import { ChurChMongoRepository } from "../infra/db/repositories/mongo/churchs";
import { ReencontroComDeusRepository } from "../infra/db/repositories/mongo/reencontroComDeus";
import { CellsMongoRepository } from "../infra/db/repositories/mongo/cells";

export const getReencontroComDeusService = async (churchId: string) => {
  const reencontroRepository = new ReencontroComDeusRepository();
  const result = await reencontroRepository.getReencontroComDeus(churchId);
  return result;
};
export const getReencontroComDeusByIdService = async (churchId: string, reencontroId: string) => {
  const reencontroRepository = new ReencontroComDeusRepository();
  const result = await reencontroRepository.getReencontroComDeusById(reencontroId);

  return result;
};

export const createReencontroComDeusService = async (data: any, churchId: string): Promise<any> => {
  const reencontroRepository = new ReencontroComDeusRepository();

  const novoReencontro = {
    data: new Date(data.data),
    reencontristas: data.reencontristas || [],
    numero: data.numero,
    descricao: data.descricao,
    churchId,
    igreja: "Avivamento Sede", // Mantendo o padrão anterior ou buscando da igreja se necessário
    equipe: [],
    financeiro: [],
  };
  const saved = await reencontroRepository.create(novoReencontro);
  return saved;
};

export const updateReencontroComDeusService = async (id: string, data: any): Promise<any> => {
  const reencontroRepository = new ReencontroComDeusRepository();

  const updateData = {
    data: new Date(data.data),
    numero: data.numero,
    descricao: data.descricao,
  };
  const result = await reencontroRepository.update(id, updateData);
  return result;
};

export const importReencontroComDeusService = async (data: any, churchId: string): Promise<any> => {
  const reencontroRepository = new ReencontroComDeusRepository();

  const cellRepository = new CellsMongoRepository();
  const redes = await cellRepository.getCells(churchId);

  const dataNormalizada = normalizarReencontristasPorIgreja(data, "Avivamento Sede", redes);
  const novoReencontro = {
    data: new Date(),
    reencontristas: dataNormalizada,
    churchId,
    numero: null,
    descricao: "Importação Automática",
    igreja: "Avivamento Sede",
    equipe: [],
    financeiro: [],
    createdAt: new Date(),
  };
  const saved = await reencontroRepository.create(novoReencontro);
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

function normalizarReencontristasPorIgreja(
  entradas: (string | any)[],
  nomeDaIgreja: string,
  redes: any[] = [],
): TPeople[] {
  return entradas.map((entrada) => {
    if (typeof entrada === "string") {
      const contemIgreja = entrada.toLowerCase().includes("igreja");

      const redeObj = contemIgreja
        ? {}
        : {
          rede: {
            name: entrada,
            _id: redes.find((r) => r.name.toLowerCase() === entrada.toLowerCase())?._id?.toString() || "",
          },
        };

      return {
        nome: "",
        igreja: contemIgreja ? entrada : nomeDaIgreja,
        ...redeObj,
      };
    }

    const redeName = getRedeName(entrada.rede || entrada.Rede || entrada.REDE);
    const contemIgreja = redeName && redeName.toLowerCase().includes("igreja");

    const phone = entrada.telefone ||
      entrada.Telefone ||
      entrada.TELEFONE ||
      entrada.WhatsApp ||
      entrada.whatsapp ||
      null

    const obj = {
      nome: entrada.nome || entrada.Nome || entrada.NOME || "",
      descricao: entrada.descricao || entrada.descricao || entrada.DESCRICAO || "",
      ...resolverIdadeOuNascimento(entrada),
      telefone: phone?.replace(/\D/g, "") || "",
      endereco: entrada.endereco
        ? `${entrada.endereco} ${entrada.bairro || ""}`.trim()
        : entrada.Endereco || entrada.ENDERECO || null,
      igreja: contemIgreja ? redeName : nomeDaIgreja,
      ...(contemIgreja
        ? {}
        : {
          rede: redeName
            ? {
              name: redeName,
              _id:
                redes.find((r) => r.name.toLowerCase() === redeName.toLowerCase())?._id?.toString() ||
                "",
            }
            : null,
        }),
    };

    return limparObjeto(obj) as TPeople;
  });
}

// ==================== SERVIÇOS FINANCEIROS SIMPLIFICADOS ====================

// Valores padrão
const VALOR_REENCONTRISTA = 200;
const VALOR_EQUIPE = 100;

// Calcula o status financeiro
const calculateStatus = (totalAPagar: number, totalPago: number): string => {
  if (totalPago === 0) return "pendente";
  if (totalPago >= totalAPagar) return totalPago > totalAPagar ? "excedente" : "quitado";
  return "parcial";
};

// Serviço para criar/atualizar inscrição de uma rede (apenas quantidades)
export const upsertInscricaoRedeService = async (data: {
  reencontroId: string;
  rede: { _id: string; name: string };
  reencontristas: TPeople[];
  equipeMembers: TEquipe[];
  pagamento: any[];
}): Promise<any> => {
  const reencontroRepository = new ReencontroComDeusRepository();

  // Calcula quantidades baseado nos arrays
  const qtdReencontristas = data.reencontristas?.length || 0;
  const qtdEquipe = data.equipeMembers?.length || 0;
  let totalPago = 0;
  let status = "pendente";

  const totalAPagar = qtdReencontristas * VALOR_REENCONTRISTA + qtdEquipe * VALOR_EQUIPE;

  if (data.pagamento.length > 0) {
    totalPago = (data?.pagamento || []).reduce((sum: number, p: any) => sum + (p.valor || 0), 0);
    status = calculateStatus(totalAPagar, totalPago);
  }

  const inscricaoData = {
    rede: data.rede,
    reencontrista: qtdReencontristas,
    equipe: qtdEquipe,
    pagamento: data.pagamento || [],
    totalAPagar,
    totalPago,
    status,
  };

  // 1. Atualiza financeiro
  await reencontroRepository.upsertInscricaoRede(data.reencontroId, data.rede._id, inscricaoData);

  const encont = data.reencontristas.map((e) => {
    return { ...e, rede: data.rede };
  });
  // 2. Remove reencontristas antigos da rede e adiciona novos
  await reencontroRepository.replaceReencontristasPorRede(data.reencontroId, data.rede._id, encont);

  // 3. Remove equipe antiga da rede e adiciona nova
  await reencontroRepository.replaceEquipePorRede(data.reencontroId, data.rede._id, data.equipeMembers);

  return { success: true };
};

// Atualizar apenas quantidades
export const updateQuantidadesService = async (data: {
  reencontroId: string;
  redeId: string;
  reencontrista: number;
  equipe: number;
}): Promise<any> => {
  const reencontroRepository = new ReencontroComDeusRepository();
  const result = await reencontroRepository.updateQuantidades(
    data.reencontroId,
    data.redeId,
    data.reencontrista,
    data.equipe,
  );
  return result;
};

// Adicionar pagamento
export const addPagamentoService = async (data: {
  reencontroId: string;
  redeId: string;
  pagamento: any;
}): Promise<any> => {
  const reencontroRepository = new ReencontroComDeusRepository();
  const result = await reencontroRepository.addPagamento(
    data.reencontroId,
    data.redeId,
    data.pagamento,
  );
  return result;
};

// Remover pagamento
export const removePagamentoService = async (data: {
  reencontroId: string;
  redeId: string;
  pagamentoId: string;
}): Promise<any> => {
  const reencontroRepository = new ReencontroComDeusRepository();
  const result = await reencontroRepository.removePagamento(
    data.reencontroId,
    data.redeId,
    data.pagamentoId,
  );
  return result;
};

// Buscar inscrição de uma rede específica com dados completos
export const getInscricaoByRedeService = async (
  reencontroId: string,
  redeId: string,
): Promise<any> => {
  const reencontroRepository = new ReencontroComDeusRepository();

  // Buscar o reencontro completo
  const reencontro = await reencontroRepository.getReencontroComDeusById(reencontroId);

  if (!reencontro) {
    throw new Error("Reencontro não encontrado");
  }

  // Buscar a inscrição financeira desta rede
  const inscricaoFinanceira = reencontro.financeiro?.find((f: any) => f.rede._id === redeId);

  // Filtrar reencontristas desta rede
  const reencontristas = reencontro.reencontristas?.filter((e: any) => e.rede._id === redeId) || [];

  // Filtrar equipe desta rede
  const equipe = reencontro.equipe?.filter((e: any) => e.rede?._id === redeId) || [];

  // Retornar dados completos
  return {
    financeiro: inscricaoFinanceira || null,
    reencontristas,
    equipe,
    reencontro: {
      _id: reencontro._id,
      numero: reencontro.numero,
      data: reencontro.data,
    },
  };
};

// Buscar todas as inscrições
export const getAllInscricoesService = async (reencontroId: string): Promise<any> => {
  const reencontroRepository = new ReencontroComDeusRepository();
  const result = await reencontroRepository.getAllInscricoes(reencontroId);
  return result;
};

function excelSerialToDate(serial: number): Date {
  // Excel conta erroneamente 1900 como bissexto, por isso subtrai 1
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400 * 1000;
  return new Date(utc_value);
}

function calcularIdade(nascimento: Date): number {
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function resolverIdadeOuNascimento(entrada: any): { idade?: number; dataNascimento?: string } {
  const rawIdade = entrada.idade || entrada.Idade || entrada.IDADE || entrada.Anos;
  const rawNasc = entrada.dataNascimento || entrada.nascimento || entrada.nasciemento || entrada.DataNascimento;

  // Se vier número serial do Excel (datas ficam entre ~20000 e ~60000)
  if (typeof rawIdade === "number" && rawIdade > 1000) {
    const data = excelSerialToDate(rawIdade);
    return {
      idade: calcularIdade(data),
      dataNascimento: data.toISOString().split("T")[0],
    };
  }

  // Se vier data de nascimento em vez da idade
  if (rawNasc) {
    const data = new Date(rawNasc);
    if (!isNaN(data.getTime())) {
      return {
        idade: calcularIdade(data),
        dataNascimento: data.toISOString().split("T")[0],
      };
    }
  }

  // Se vier já como número simples (ex: 25)
  return { idade: rawIdade ? Number(rawIdade) : undefined };
}