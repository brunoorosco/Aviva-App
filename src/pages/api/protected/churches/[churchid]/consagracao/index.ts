import { createConsagracaoService, getConsagracaoByChurchIdService } from "@/services/consagracao";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    if (req.method == "POST") {
      const user = await createConsagracaoService(churchId, req.body);
      res.status(201).json(user);
    } else if (req.method == "GET") {
      const casas = await getConsagracaoByChurchIdService(churchId);
      res.send(casas);
    } else {
      res.send("");
    }
  } catch (error) {
    console.error(error);
    //@ts-ignore
    res.status(400).json({ error: error.message });
  }
};
