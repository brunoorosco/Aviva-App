import type { NextApiRequest, NextApiResponse } from "next";
import { DiscipuladoMongoRepository } from "@/infra/db/repositories/mongo/discipulado";
import { AulaDiscipulado } from "@/domain/models/discupulado";

type Error = {
  message: string;
};

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse<AulaDiscipulado | Error>,
) {
 const { id} = req.query;

 if (!id || typeof id !== "string") {
 return res.status(400).json({ message: "Invalid or missing id parameter" });
 }

  try {
 const repository = new DiscipuladoMongoRepository();

 if (req.method === "GET") {
  const aula = await repository.getAulaById(id);

  if (!aula) {
    return res.status(404).json({ message: "Aula not found" });
     }

  return res.status(200).json(aula);
   } else if (req.method === "PUT") {
  const aulaAtualizada = req.body;

   // Validações básicas
  if (!aulaAtualizada.data || !aulaAtualizada.tema || !aulaAtualizada.ministrador) {
    return res
       .status(400)
       .json({ message: "Missing required fields: data, tema, ministrador" });
     }

  const result = await repository.updateAula(id, aulaAtualizada);

  if (!result) {
    return res.status(404).json({ message: "Aula not found" });
     }

  return res.status(200).json(result);
   } else if (req.method === "DELETE") {
  const deleted = await repository.deleteAula(id);

  if (!deleted) {
    return res.status(404).json({ message: "Aula not found" });
     }

  return res.status(200).json({ message: "Aula deleted successfully" });
   } else {
  return res.status(405).json({ message: "Method not allowed" });
   }
 } catch (error: any) {
 console.error("Error handling aula:", error);
 return res.status(500).json({ message: error.message || "Erro ao processar aula" });
 }
}
