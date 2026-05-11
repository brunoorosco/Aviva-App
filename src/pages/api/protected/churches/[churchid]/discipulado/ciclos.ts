import type { NextApiRequest, NextApiResponse } from "next";
import { DiscipuladoMongoRepository } from "@/infra/db/repositories/mongo/discipulado";
import { CicloDiscipulado } from "@/domain/models/discupulado";
import { withAudit } from "@/middlewares/withAudit";

type Error = {
  message: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CicloDiscipulado[] | CicloDiscipulado | Error>,
) {

  try {
    const repository = new DiscipuladoMongoRepository();

    if (req.method === "GET") {
      const ciclos = await repository.getAllCiclos();
      return res.status(200).json(ciclos);
    } else if (req.method === "POST") {
      const novoCiclo = req.body;

      // Validações básicas
      if (!novoCiclo.nome || !novoCiclo.dataInicio || !novoCiclo.dataFim) {
        return res.status(400).json({ message: "Missing required fields: nome, dataInicio, dataFim" });
      }

      const ciclo = await repository.createCiclo({
        ...novoCiclo,
        ativo: novoCiclo.ativo || false,
      });

      return res.status(201).json(ciclo);
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Error handling ciclos:", error);
    return res.status(500).json({ message: error.message || "Erro ao processar ciclos" });
  }
}

export default withAudit(handler);

