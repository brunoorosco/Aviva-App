import { toggleParticipanteIsentoConferenciaService } from "@/services/conferencia";
import { NextApiRequest, NextApiResponse } from "next";
import { withAudit } from "@/middlewares/withAudit";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const conferenciaId = (req.query?.id as string) || "";
    const { participanteId } = req.body;

    if (!conferenciaId || !participanteId) {
      res.status(400).json({ error: "conferenciaId e participanteId são obrigatórios" });
      return;
    }

    const result = await toggleParticipanteIsentoConferenciaService(
      conferenciaId,
      participanteId
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao toggle isento:", error);
    res.status(400).json({ error: "Erro ao alterar status de isento" });
  }
};

export default withAudit(handler);
