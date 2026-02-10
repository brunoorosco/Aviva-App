import { addConsagratedService, addConsagratedUsersService, getConsagracaoByIdService } from "@/services/consagracao";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    const consagracaoId = (req.query?.id as string) || "";

    if (req.method == "PUT") {
      const consagracao = await addConsagratedService(churchId, consagracaoId, req.body);
      res.status(200).json(consagracao);
    } else if (req.method == "POST") {
      const users = await addConsagratedUsersService(churchId, consagracaoId, req.body);
      res.send(users);
    } else if (req.method == "GET") {
      const casas = await getConsagracaoByIdService(churchId, consagracaoId);
      res.send(casas);
    } else {
      res.send("");
    }
  } catch (error) {
    //@ts-ignore
    console.error(error);
    res.status(400).json({ error: "Falha na conexão com tb usuário" });
  }
};
