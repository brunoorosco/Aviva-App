import { withAudit } from '@/middlewares/withAudit';
import { importReencontroComDeusService } from "@/services/reencontroComDeus";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const churchId = (req.query?.churchid as string) || "";
    if (req.method == "POST") {
      const result = await importReencontroComDeusService(req.body, churchId);
      res.status(201).json({ result });
    } else {
      res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao processar importação" });
  }
};

export default withAudit(handler);