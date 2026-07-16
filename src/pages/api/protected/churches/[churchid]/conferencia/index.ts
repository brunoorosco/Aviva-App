import { createConferenciaService, getConferenciasService } from "@/services/conferencia";
import { NextApiRequest, NextApiResponse } from "next";
import { withAudit } from "@/middlewares/withAudit";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    const page = parseInt(req.query?.page as string) || 1;
    const limit = parseInt(req.query?.limit as string) || 10;

    if (req.method === "POST") {
      const conferencia = await createConferenciaService({ ...req.body, churchId, createdAt: new Date() });
      res.status(201).json({ conferencia });
    } else if (req.method === "GET") {
      const result = await getConferenciasService(churchId, page, limit);
      res.status(200).json(result);
    } else {
      res.status(405).send("");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro na operação de conferência" });
  }
};

export default withAudit(handler);
