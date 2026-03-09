import type { NextApiRequest, NextApiResponse } from "next";
import { DiscipuladoMongoRepository } from "@/infra/db/repositories/mongo/discipulado";

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        membroId: string;
        nome: string;
        celula: string;
        aulasPendentes: string[];
      }[]
    | Error
  >,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { cicloId } = req.query;

    if (!cicloId) {
      return res.status(400).json({ message: "Missing required query parameter: cicloId" });
    }

    const repository = new DiscipuladoMongoRepository();
    const pendencias = await repository.getPendenciasByCicloId(cicloId as string);

    return res.status(200).json(pendencias);
  } catch (error: any) {
    console.error("Error fetching pendencias:", error);
    return res.status(500).json({ message: error.message || "Erro ao buscar pendências" });
  }
}
