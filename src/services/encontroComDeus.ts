import { TEquipe, TPeople } from "@/domain/models/encontroComDeus";
import { ChurChMongoRepository } from "../infra/db/repositories/mongo/churchs";
import { EncontroComDeusRepository } from "../infra/db/repositories/mongo/encontroComDeus";
import { CellsMongoRepository } from "../infra/db/repositories/mongo/cells";
import { UsersMongoRepository } from "../infra/db/repositories/mongo/users";

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

export const createEncontroComDeusService = async (data: any, churchId: string): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();

  const novoEncontro = {
    data: new Date(data.data),
    encontristas: data.encontristas || [],
    numero: data.numero,
    descricao: data.descricao,
    churchId,
    igreja: "Avivamento Sede", // Mantendo o padrão anterior ou buscando da igreja se necessário
    equipe: [],
    financeiro: [],
  };
  const saved = await encontroRepository.create(novoEncontro);
  return saved;
};

export const updateEncontroComDeusService = async (id: string, data: any): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();

  const updateData: Record<string, any> = {
    data: new Date(data.data),
    numero: data.numero,
    descricao: data.descricao,
  };

  if (data.allowPastEdits !== undefined) {
    updateData.allowPastEdits = data.allowPastEdits;
  }
  const result = await encontroRepository.update(id, updateData);
  return result;
};

export const importEncontroComDeusService = async (data: any, churchId: string): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();

  const cellRepository = new CellsMongoRepository();
  const redes = await cellRepository.getCells(churchId);

  const dataNormalizada = normalizarEncontristasPorIgreja(data, "Avivamento Sede", redes);
  const novoEncontro = {
    data: new Date(),
    encontristas: dataNormalizada,
    churchId,
    numero: null,
    descricao: "Importação Automática",
    igreja: "Avivamento Sede",
    equipe: [],
    financeiro: [],
    createdAt: new Date(),
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
  const encontristas = encontro.encontristas?.filter((e: any) => e.rede._id === redeId) || [];

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
export const convertToMemberService = async (
  churchId: string,
  encontroId: string,
  encontristaId: string,
): Promise<any> => {
  const encontroRepository = new EncontroComDeusRepository();
  const userRepository = new UsersMongoRepository();

  const encontro = await encontroRepository.getEncontroComDeusById(encontroId);
  if (!encontro) throw new Error("Encontro não encontrado");

  const encontrista = encontro.encontristas?.find((e: any) => e._id === encontristaId);
  if (!encontrista) throw new Error("Encontrista não encontrado");

  if (encontrista.isMembro) throw new Error("Este participante já é um membro");

  // Mapear dados para o novo usuário
  const userData: any = {
    churchId,
    name: encontrista.nome,
    email: encontrista.email || "",
    phone: encontrista.telefone || "",
    active: true,
    birthDate: encontrista.dataNascimento || "",
    cem: encontrista.rede || null,
    role: "membro",
    password: "123", // Senha padrão inicial
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    encontroComDeus: true,
  };

  // Criar o usuário
  const result = await userRepository.create(userData);
  if (!result) throw new Error("Erro ao criar usuário");

  // Marcar encontrista como membro
  await encontroRepository.markEncontristaAsMember(encontroId, encontristaId);

  return result;
};
