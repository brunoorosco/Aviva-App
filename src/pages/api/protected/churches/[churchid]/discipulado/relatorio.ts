import type { NextApiRequest, NextApiResponse } from "next";
import { DiscipuladoMongoRepository } from "@/infra/db/repositories/mongo/discipulado";
import { RelatorioCiclo } from "@/domain/models/discupulado";
import { withAudit } from "@/middlewares/withAudit";

type Error = {
  message: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RelatorioCiclo | Error>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { cicloId } = req.query;

    if (!cicloId || typeof cicloId !== "string") {
      return res.status(400).json({ message: "Missing required query parameter: cicloId" });
    }

    const repository = new DiscipuladoMongoRepository();
    const relatorio = await repository.getRelatorioCiclo(cicloId);

    if (!relatorio) {
      return res.status(404).json({ message: "Ciclo not found" });
    }

    return res.status(200).json(relatorio);
  } catch (error: any) {
    console.error("Error fetching discipulado relatorio:", error);
    return res.status(500).json({ message: error.message || "Erro ao buscar relatório" });
  }
}

export default withAudit(handler);
