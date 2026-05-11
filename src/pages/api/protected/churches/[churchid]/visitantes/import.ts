import { withAudit } from '@/middlewares/withAudit';
import { createVisitantesImportService } from "@/services/visitantes";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const churchId = (req.query?.churchid as string) || "";
    if (req.method == "POST") {
      const user = await createVisitantesImportService(req.body, churchId);
      res.status(201).json({ user });
    } else {
      res.send("");
    }
  } catch (error) {
    //@ts-ignore
    console.error(error);
    res.status(400).json({ error: "Falha na conexão com tb usuário" });
  }
};

export default withAudit(handler);