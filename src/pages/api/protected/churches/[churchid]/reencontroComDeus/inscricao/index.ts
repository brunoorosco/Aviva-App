import { withAudit } from '@/middlewares/withAudit';
import { NextApiRequest, NextApiResponse } from "next";
import {
  upsertInscricaoRedeService,
  updateQuantidadesService,
  addPagamentoService,
  removePagamentoService,
  getInscricaoByRedeService,
  getAllInscricoesService,
} from "@/services/reencontroComDeus";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { churchid, reencontroId, redeId } = req.query;

    // GET - Buscar inscrições
    if (req.method === "GET") {
      if (!reencontroId || typeof reencontroId !== "string") {
        return res.status(400).json({ error: "ID do reencontro é obrigatório" });
      }

      // Se tiver redeId, busca só da rede específica
      if (redeId && typeof redeId === "string") {
        const inscricao = await getInscricaoByRedeService(reencontroId, redeId);
        return res.status(200).json(inscricao);
      }

      // Senão busca todas
      const inscricoes = await getAllInscricoesService(reencontroId);
      return res.status(200).json(inscricoes);
    }

    // POST - Criar/Atualizar inscrição completa
    if (req.method === "POST") {
      if (!reencontroId || typeof reencontroId !== "string") {
        return res.status(400).json({ error: "ID do reencontro é obrigatório" });
      }

      const { financeiro, reencontristas, equipeMembers, rede} = req.body;

      if (!rede || !rede._id || !rede.name) {
        return res.status(400).json({ error: "Informações da rede são obrigatórias" });
      }

      const result = await upsertInscricaoRedeService({
        reencontroId,
        rede,
        reencontristas: reencontristas || [],
        equipeMembers: equipeMembers || [],
        pagamento: financeiro.pagamento || [],
      });

      return res.status(201).json({
        message: "Inscrição salva com sucesso",
        result,
      });
    }

    // PUT - Atualizar apenas quantidades
    if (req.method === "PUT") {
      if (!reencontroId || typeof reencontroId !== "string") {
        return res.status(400).json({ error: "ID do reencontro é obrigatório" });
      }

      if (!redeId || typeof redeId !== "string") {
        return res.status(400).json({ error: "ID da rede é obrigatório" });
      }

      const { reencontrista, equipe } = req.body;

      if (typeof reencontrista !== "number" || typeof equipe !== "number") {
        return res.status(400).json({ error: "Reencontrista e equipe devem ser números" });
      }

      const result = await updateQuantidadesService({
        reencontroId,
        redeId,
        reencontrista,
        equipe,
      });

      return res.status(200).json({
        message: "Quantidades atualizadas com sucesso",
        result,
      });
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Erro na rota de inscrição:", error);
    return res.status(500).json({ error: "Erro ao processar inscrição" });
  }
}

export default withAudit(handler);