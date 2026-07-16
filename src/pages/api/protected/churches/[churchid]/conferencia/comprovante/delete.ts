import { withAudit } from "@/middlewares/withAudit";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteComprovanteFromCloudinary } from "@/lib/cloudinary";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { url, publicId } = req.body;

    if (!url && !publicId) {
      return res.status(400).json({ error: "URL ou publicId é obrigatório" });
    }

    await deleteComprovanteFromCloudinary(url || publicId);

    return res.status(200).json({ message: "Comprovante deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar comprovante da conferência:", error);
    return res.status(500).json({ error: "Erro ao deletar comprovante" });
  }
}

export default withAudit(handler);
