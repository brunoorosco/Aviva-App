import { EncontroComDeusRepository } from "@/infra/db/repositories/mongo/encontroComDeus";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    if (req.method == "GET") {
     const repository = new EncontroComDeusRepository()     
      const [total] = await repository.fechamentoAnual('2025');
      res.send(total);
    } else {
      res.send("");
    }
  } catch (error) {
    console.error(error);
    //@ts-ignore
    res.status(400).json({ error: error.message });
  }
};
