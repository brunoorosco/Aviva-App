import { withAudit } from '@/middlewares/withAudit';
import type { NextApiRequest, NextApiResponse } from "next";
import { 
  deleteMinisterioService, 
  getMinisterioByIdService, 
  updateMinisterioService 
} from "@/services/ministerioService";

interface Error {
  message: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse<any | null>) {
  const churchId = req.query.churchid as string;
  const ministerioId = req.query.ministerioid as string;

  try {
    if (req.method === "GET") {
      const ministerio = await getMinisterioByIdService(churchId, ministerioId);
      if (!ministerio) {
        return res.status(404).json({ message: `Ministério [${ministerioId}] não encontrado.` });
      }
      return res.status(200).json(ministerio);
    } else if (req.method === "DELETE") {
      const deleted = await deleteMinisterioService(churchId, ministerioId);
      return res.status(200).json(deleted);
    } else if (req.method === "PUT") {
      const updated = await updateMinisterioService(churchId, ministerioId, req.body);
      return res.status(200).json(updated);
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Error in ministerios API:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}

export default withAudit(handler);