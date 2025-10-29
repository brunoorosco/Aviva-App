import { createVisitantesService, getVisitantesService } from "@/services/visitantes";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    if (req.method == "POST") {
      const user = await createVisitantesService(req.body, churchId);
      res.status(201).json({ user });
    } else if (req.method == "GET") {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const batismo = await getVisitantesService(churchId, pageNumber, limitNumber);
      res.send(batismo);
    } else {
      res.send("");
    }
  } catch (error) {
    //@ts-ignore
    console.error(error);
    res.status(400).json({ error: "Falha na conexão com tb usuário" });
  }
};
