import {
  getConferenciaByIdService,
  updateConferenciaService,
  updateConferenciaAllowPastEditsService,
} from "@/services/conferencia";
import { NextApiRequest, NextApiResponse } from "next";
import { withAudit } from "@/middlewares/withAudit";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    const conferenciaId = (req.query?.id as string) || "";

    if (req.method === "PUT") {
      const result = await updateConferenciaService(conferenciaId, req.body);
      res.status(200).json({ result });
    } else if (req.method === "PATCH") {
      const result = await updateConferenciaAllowPastEditsService(
        conferenciaId,
        req.body.allowPastEdits
      );
      res.status(200).json({ result });
    } else if (req.method === "GET") {
      const conferencia = await getConferenciaByIdService(churchId, conferenciaId);
      res.status(200).send(conferencia);
    } else {
      res.status(405).send("");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro na operação de conferência" });
  }
};

export default withAudit(handler);
