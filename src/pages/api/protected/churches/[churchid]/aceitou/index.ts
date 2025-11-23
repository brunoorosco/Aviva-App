import { createAceitouService, getAceitouService } from "@/services/aceitou";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
     const { churchid, page = 1, limit = 10, name } = req.query

      const pageNumber = parseInt(page as string, 10)
      const limitNumber = parseInt(limit as string, 10)

    if (req.method == "POST") {
      const user = await createAceitouService(req.body, churchid as string);
      res.status(201).json({ user });
    } else if (req.method == "GET") {
      const users = await getAceitouService(churchid as string, pageNumber, limitNumber);
      res.send(users);
    } else {
      res.send("");
    }
  } catch (error) {
    //@ts-ignore
    console.error(error);
    res.status(400).json({ error: "Falha na conexão com tb usuário" });
  }
};
