import type { NextApiRequest, NextApiResponse } from "next";
import { DiscipuladoMongoRepository } from "@/infra/db/repositories/mongo/discipulado";
import { withAudit } from "@/middlewares/withAudit";

type ResponseData = {
  message: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { id } = req.query; // id da aula

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid or missing id parameter" });
  }

  if (req.method === "PATCH") {
    const { membroId, presente, studentData } = req.body;

    if (!membroId) {
      return res.status(400).json({ message: "Missing membroId" });
    }

    try {
      const repository = new DiscipuladoMongoRepository();
      const success = await repository.updatePresencaAluno(id, membroId, presente, studentData);

      if (!success) {
        return res.status(404).json({ message: "Aula not found or update failed" });
      }

      return res.status(200).json({ message: "Presence updated successfully" });
    } catch (error: any) {
      console.error("Error updating presence:", error);
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default withAudit(handler);
