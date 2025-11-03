import { VisitantesRepository } from "@/infra/db/repositories/mongo/visitantes";
import { ObjectId } from "mongodb";

export const createVisitantesService = async (data: any, churchId: string): Promise<any> => {
  const visitantesRepository = new VisitantesRepository();

  // Monta a rede se existir
  let rede: { name: string; _id: string } | undefined = undefined;
  if (data?.cem) {
    rede = {
      name: data.cem.split("-")[1] as string,
      _id: data.cem.split("-")[0] as string,
    };
  }

  // Monta o objeto final
  const dataFormatted: any = {
    visitedAt: new Date(data.visitedAt),
    name: data.name?.trim(),
    phone: data.phone?.replace(/[^0-9]/g, "") || null,
    description: data.description?.trim() || null,
    region: data.region?.trim() || null,
    howHeard: data.howHeard || null,
  };

  // Só inclui invitedBy se howHeard for "invited"
  if (data.howHeard === "invited") {
    dataFormatted.invitedBy = data.invitedBy?.trim() || null;
  }

  const saved = await visitantesRepository.create(dataFormatted, churchId);
  return saved;
};

export const createVisitantesImportService = async (data: any, churchId: string): Promise<any> => {
  const visitantesRepository = new VisitantesRepository();

  const visitantes = data.map((i: any) => {
    const howHeard = i.como_nos_conheceu === "convidado" ? "invited" : i.como_nos_conheceu || null;

    const visitante: any = {
      visitedAt: new Date(excelDateToJSDate(i.data_visita)),
      name: i.nome?.trim(),
      phone: i.telefone?.replace(/[^0-9]/g, "") || null,
      description: i.description?.trim() || null,
      region: i.regiao?.trim() || null,
      howHeard,
      churchId,
      createdAt: new Date(),
      _id: new ObjectId(),
    };

    if (howHeard === "invited" && i.quem_convidou?.trim()) {
      visitante.invitedBy = i.quem_convidou.trim();
    }

    return visitante;
  });

  const saved = await visitantesRepository.import(visitantes);
  return saved;
};

export const getVisitantesService = async (churchId: string, page: number, limit: number) => {
  const aceitouRepository = new VisitantesRepository();
  const result = await aceitouRepository.getVisitantes(churchId, page, limit);

  return result;
};
export const getVisitantesAnalyticsService = async (churchId: string) => {
  const visitors = new VisitantesRepository();
  const result = await visitors.countVisitors(churchId);

  return result;
};

function excelDateToJSDate(serial: number): Date {
  const utcDays = Math.floor(serial - 25569); // 25569 = 1 jan 1970 - 1 jan 1900
  const utcValue = utcDays * 86400; // segundos
  const dateInfo = new Date(utcValue * 1000);

  const fractionalDay = serial - Math.floor(serial);
  const totalSeconds = Math.floor(86400 * fractionalDay);

  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  dateInfo.setUTCHours(hours, minutes, seconds);

  return dateInfo;
}
