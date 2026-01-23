import { AceitouRepository } from "@/infra/db/repositories/mongo/aceitou";

export const getAceitouService = async (churchId: string, page: number, limit: number) => {
  const aceitouRepository = new AceitouRepository();
  const result = await aceitouRepository.getUseusAceitou(churchId, page, limit);

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

  const hasEncontro = data.hasEncontro === true || data.hasEncontro === "true";

  /**
   * Processa a data do apelo:
   * - Se for a mesma data de hoje (Brasília) → usa o horário atual real
   * - Se for data diferente → usa meio-dia UTC para evitar problemas de fuso
   */
  const processAcceptedDate = (dateString: string | null | undefined): Date => {
    const now = new Date();

    // Data de hoje no fuso de Brasília (YYYY-MM-DD)
    const todayBrasilia = now.toLocaleDateString("en-CA", {
      timeZone: "America/Sao_Paulo",
    }); // formato "2025-01-15"

    // Se não informou data ou é a data de hoje → usa horário atual
    if (!dateString || dateString === todayBrasilia) {
      return now;
    }

    // Se é data diferente → usa meio-dia UTC para não ter problema de fuso
    const [year, month, day] = dateString.split("-");
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0));
  };

  const dataFormatted: any = {
    acceptedAt: processAcceptedDate(data.acceptedAt),
    name: data.name?.trim() as string,
    email: data.email?.trim() || null,
    phone: data.phone?.replace(/[^0-9]/g, "") || null,
    rede,
    accepted: data.accepted === true || data.accepted === "true",
    baptism: data.baptism === true || data.baptism === "true",
    description: data.description?.trim() || null,
    hasEncontro,
    ...(hasEncontro && { numberEncontro: data.numberEncontro?.trim() || null }),
  };

  const saved = await aceitouRepository.create(dataFormatted, churchId);
  return saved;
};

export const importAceitouService = async (data: any, churchId: string): Promise<any> => {
  const aceitouRepository = new AceitouRepository();
  const saved = await aceitouRepository.create(data, churchId);
  return saved;
};
