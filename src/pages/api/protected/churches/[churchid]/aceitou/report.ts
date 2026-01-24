import { createAceitouService, getAceitouService, reportAceitouService } from "@/services/aceitou";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
     const { churchid,  name } = req.query

 if (req.method == "GET") {
      const users = await reportAceitouService(churchid as string);
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
