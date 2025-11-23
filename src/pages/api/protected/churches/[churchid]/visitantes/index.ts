import { createVisitantesService, getVisitantesService } from "@/services/visitantes";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { churchid, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    if (req.method == "POST") {
      const user = await createVisitantesService(req.body, churchid as string);
      res.status(201).json({ user });
    } else if (req.method == "GET") {
      const batismo = await getVisitantesService(churchid as string, pageNumber, limitNumber);
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
