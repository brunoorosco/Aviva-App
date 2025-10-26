import { createAceitouService, getAceitouService } from "@/services/aceitou";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    if (req.method == "POST") {
      const user = await createAceitouService(req.body, churchId);
      res.status(201).json({ user });
    } else if (req.method == "GET") {
      const users = await getAceitouService(churchId);
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
