import type { NextApiRequest, NextApiResponse } from "next";
import { DiscipuladoMongoRepository } from "@/infra/db/repositories/mongo/discipulado";
import { AulaDiscipulado } from "@/domain/models/discupulado";

type Error = {
  message: string;
};

import { withAudit } from "@/middlewares/withAudit";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AulaDiscipulado[] | AulaDiscipulado | Error>,
) {

  try {
    const repository = new DiscipuladoMongoRepository();

    if (req.method === "GET") {
      const { cicloId } = req.query;

      const aulas = await repository.getAulasByCicloId(cicloId as string);
      return res.status(200).json(aulas);
    } else if (req.method === "POST") {
      const novaAula = req.body;

      // Validações básicas
      if (!novaAula.data || !novaAula.tema || !novaAula.ministrador ) {
        return res
          .status(400)
          .json({ message: "Missing required fields: data, tema, ministrador, cicloId" });
      }

      const aula = await repository.createAula({
        ...novaAula,
        alunos: novaAula.alunos || [],
      });

      return res.status(201).json(aula);
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Error handling aulas:", error);
    return res.status(500).json({ message: error.message || "Erro ao processar aulas" });
  }
}

export default withAudit(handler);
