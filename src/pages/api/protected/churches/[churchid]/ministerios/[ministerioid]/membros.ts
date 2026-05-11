import { withAudit } from '@/middlewares/withAudit';
import type { NextApiRequest, NextApiResponse } from "next";
import { addMembroMinisterioService, removeMembroMinisterioService } from "@/services/ministerioService";

async function handler(req: NextApiRequest, res: NextApiResponse<any | null>) {
  const churchId = req.query.churchid as string;
  const ministerioId = req.query.ministerioid as string;

  if (req.method === "POST") {
    // Adiciona um membro ou líder
    const { userId, userName, tipo } = req.body;
    
    if (!userId || !userName || !tipo) {
      return res.status(400).json({ message: "Missing required fields: userId, userName, tipo" });
    }
    
    if (tipo !== 'membro' && tipo !== 'lider') {
      return res.status(400).json({ message: "tipo must be 'membro' or 'lider'" });
    }
    
    try {
      const result = await addMembroMinisterioService(churchId, ministerioId, userId, userName, tipo);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === "DELETE") {
    // Remove um membro ou líder
    const { userId, tipo } = req.body;
    
    if (!userId || !tipo) {
      return res.status(400).json({ message: "Missing required fields: userId, tipo" });
    }
    
    if (tipo !== 'membro' && tipo !== 'lider') {
      return res.status(400).json({ message: "tipo must be 'membro' or 'lider'" });
    }
    
    try {
      const result = await removeMembroMinisterioService(churchId, ministerioId, userId, tipo);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default withAudit(handler);