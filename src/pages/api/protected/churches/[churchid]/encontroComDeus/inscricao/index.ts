import { NextApiRequest, NextApiResponse } from "next";
import {
  upsertInscricaoRedeService,
  updateQuantidadesService,
  addPagamentoService,
  removePagamentoService,
  getInscricaoByRedeService,
  getAllInscricoesService,
} from "@/services/encontroComDeus";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { churchid, encontroId, redeId } = req.query;

    // GET - Buscar inscrições
    if (req.method === "GET") {
      if (!encontroId || typeof encontroId !== "string") {
        return res.status(400).json({ error: "ID do encontro é obrigatório" });
      }

      // Se tiver redeId, busca só da rede específica
      if (redeId && typeof redeId === "string") {
        const inscricao = await getInscricaoByRedeService(encontroId, redeId);
        return res.status(200).json(inscricao);
      }

      // Senão busca todas
      const inscricoes = await getAllInscricoesService(encontroId);
      return res.status(200).json(inscricoes);
    }

    // POST - Criar/Atualizar inscrição completa
    if (req.method === "POST") {
      if (!encontroId || typeof encontroId !== "string") {
        return res.status(400).json({ error: "ID do encontro é obrigatório" });
      }

      const { financeiro, encontristas, equipeMembers, rede} = req.body;

      if (!rede || !rede._id || !rede.name) {
        return res.status(400).json({ error: "Informações da rede são obrigatórias" });
      }

      const result = await upsertInscricaoRedeService({
        encontroId,
        rede,
        encontristas: encontristas || [],
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
      if (!encontroId || typeof encontroId !== "string") {
        return res.status(400).json({ error: "ID do encontro é obrigatório" });
      }

      if (!redeId || typeof redeId !== "string") {
        return res.status(400).json({ error: "ID da rede é obrigatório" });
      }

      const { encontrista, equipe } = req.body;

      if (typeof encontrista !== "number" || typeof equipe !== "number") {
        return res.status(400).json({ error: "Encontrista e equipe devem ser números" });
      }

      const result = await updateQuantidadesService({
        encontroId,
        redeId,
        encontrista,
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
