import { ConferenciaRepository } from "@/infra/db/repositories/mongo/conferencia";

export const getConferenciasService = async (
  churchId: string,
  page: number = 1,
  limit: number = 10
) => {
  const repo = new ConferenciaRepository();
  return repo.getConferencias(churchId, page, limit);
};

export const getConferenciaByIdService = async (
  churchId: string,
  id: string
) => {
  const repo = new ConferenciaRepository();
  return repo.getConferenciaById(id);
};

export const createConferenciaService = async (data: any): Promise<any> => {
  const repo = new ConferenciaRepository();
  return repo.create(data);
};

export const updateConferenciaService = async (
  id: string,
  data: any
): Promise<any> => {
  const repo = new ConferenciaRepository();
  return repo.update(id, data);
};

export const updateConferenciaAllowPastEditsService = async (
  id: string,
  allowPastEdits: boolean
): Promise<any> => {
  const repo = new ConferenciaRepository();
  return repo.updateAllowPastEdits(id, allowPastEdits);
};

export const upsertInscricaoRedeConferenciaService = async ({
  conferenciaId,
  rede,
  participantes,
  equipeMembers,
  pagamento,
}: {
  conferenciaId: string;
  rede: { _id: string; name: string };
  participantes: any[];
  equipeMembers: any[];
  pagamento: any[];
}): Promise<any> => {
  const repo = new ConferenciaRepository();

  // Atualiza participantes e equipe
  await repo.replaceParticipantesPorRede(
    conferenciaId,
    rede._id,
    participantes.map((p) => ({ ...p, rede }))
  );
  await repo.replaceEquipePorRede(
    conferenciaId,
    rede._id,
    equipeMembers.map((m) => ({ ...m, rede }))
  );

  // Calcula totais financeiros
  const participantesNaoIsentos = participantes.filter((p) => !p.isento).length;
  const equipeNaoIsenta = equipeMembers.filter((m) => !m.isento).length;
  const totalPago = pagamento.reduce((sum, p) => sum + p.valor, 0);
  const totalAPagar = participantesNaoIsentos * 50 + equipeNaoIsenta * 50;

  let status: "quitado" | "parcial" | "pendente" | "excedente";
  if (totalPago === 0) status = "pendente";
  else if (totalPago < totalAPagar) status = "parcial";
  else if (totalPago === totalAPagar) status = "quitado";
  else status = "excedente";

  const inscricaoData = {
    rede,
    participante: participantes.length,
    pagamento,
    totalPago,
    totalAPagar,
    status,
  };

  const result = await repo.upsertInscricaoRede(conferenciaId, rede._id, inscricaoData);

  return { success: true, result };
};

export const getInscricaoByRedeConferenciaService = async (
  conferenciaId: string,
  redeId: string
) => {
  const repo = new ConferenciaRepository();
  return repo.getInscricaoByRede(conferenciaId, redeId);
};

export const removePagamentoConferenciaService = async (
  conferenciaId: string,
  redeId: string,
  pagamentoId: string
) => {
  const repo = new ConferenciaRepository();
  return repo.removePagamento(conferenciaId, redeId, pagamentoId);
};
