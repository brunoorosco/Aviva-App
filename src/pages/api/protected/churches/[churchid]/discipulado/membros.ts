import type { NextApiRequest, NextApiResponse } from "next";
import { DiscipuladoMongoRepository } from "@/infra/db/repositories/mongo/discipulado";

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[] | Error>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const repository = new DiscipuladoMongoRepository();
    const membros = await repository.getAllMembros();

    return res.status(200).json(membros);
  } catch (error: any) {
    console.error("Error fetching membros:", error);
    return res.status(500).json({ message: error.message || "Erro ao buscar membros" });
  }
}
