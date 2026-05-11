import { withAudit } from '@/middlewares/withAudit';
import { deleteCemsByIdService, getCemsByIdService, saveCemsService } from "@/services/cems";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    const cemId = (req.query?.id as string) || "";

    if (req.method == "PUT") {
      const casa = await saveCemsService(req.body);
      res.status(200).json({ casa });
    } else if (req.method == "POST") {
      const casa = await saveCemsService(req.body);
      res.status(200).json({ casa });
    } else if (req.method == "GET") {
      const casas = await getCemsByIdService(churchId, cemId);
      res.send(casas);
    } else if (req.method == "DELETE") {
      const casas = await deleteCemsByIdService({ churchId, cemId });
      res.send(casas);
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