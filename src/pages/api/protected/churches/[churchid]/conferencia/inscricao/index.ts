import { withAudit } from "@/middlewares/withAudit";
import { NextApiRequest, NextApiResponse } from "next";
import {
  upsertInscricaoRedeConferenciaService,
  getInscricaoByRedeConferenciaService,
} from "@/services/conferencia";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { churchid, conferenciaId, redeId } = req.query;

    if (req.method === "GET") {
      if (!conferenciaId || typeof conferenciaId !== "string") {
        return res.status(400).json({ error: "ID da conferência é obrigatório" });
      }

      if (redeId && typeof redeId === "string") {
        const inscricao = await getInscricaoByRedeConferenciaService(conferenciaId, redeId);
        return res.status(200).json(inscricao);
      }

      return res.status(400).json({ error: "redeId é obrigatório para buscar inscrição" });
    }

    if (req.method === "POST") {
      if (!conferenciaId || typeof conferenciaId !== "string") {
        return res.status(400).json({ error: "ID da conferência é obrigatório" });
      }

      const { financeiro, participantes, equipeMembers, rede } = req.body;

      if (!rede || !rede._id || !rede.name) {
        return res.status(400).json({ error: "Informações da rede são obrigatórias" });
      }

      const result = await upsertInscricaoRedeConferenciaService({
        conferenciaId,
        rede,
        participantes: participantes || [],
        equipeMembers: equipeMembers || [],
        pagamento: financeiro?.pagamento || [],
      });

      return res.status(201).json({
        message: "Inscrição salva com sucesso",
        result,
      });
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Erro na rota de inscrição de conferência:", error);
    return res.status(500).json({ error: "Erro ao processar inscrição" });
  }
}

export default withAudit(handler);
