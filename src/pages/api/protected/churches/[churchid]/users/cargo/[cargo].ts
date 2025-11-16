import { TMinisterialLevel } from "@/domain/models/ministerial";
import { getUsersByStatus } from "@/services/users";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { churchid, cargo } = req.query;
    if (!churchid || !cargo) {
      return res.status(400).json({ message: "Parâmetros inválidos" });
    }

    try {
      const users = await getUsersByStatus(churchid as string, cargo as TMinisterialLevel);

      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === "PUT") {
    const { cargo } = req.query;

    return res.status(200).json({ message: "ok" });
  }

  return res.status(405).json({ message: "Método não permitido" });
}
