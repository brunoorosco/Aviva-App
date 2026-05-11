import { withAudit } from '@/middlewares/withAudit';
import { importEncontroComDeusService } from "@/services/encontroComDeus";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    if (req.method == "POST") {
      const result = await importEncontroComDeusService(req.body, churchId);
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