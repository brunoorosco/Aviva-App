import { createAceitouService, getAceitouService } from "@/services/aceitou";
import { NextApiRequest, NextApiResponse } from "next";
import { withAudit } from "@/middlewares/withAudit";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
     const { churchid, page = 1, limit = 10, name, rede, dateStart, dateEnd } = req.query

      const pageNumber = parseInt(page as string, 10)
      const limitNumber = parseInt(limit as string, 10)

    if (req.method == "POST") {
      const user = await createAceitouService(req.body, churchid as string);
      res.status(201).json({ user });
    } else if (req.method == "GET") {
      const filters = {
        name: name as string,
        rede: rede as string,
        dateStart: dateStart as string,
        dateEnd: dateEnd as string,
      };
      
      // Remove campos vazios
      Object.keys(filters).forEach(key => {
        if (!filters[key as keyof typeof filters]) {
          delete filters[key as keyof typeof filters];
        }
      });
      
      const users = await getAceitouService(churchid as string, pageNumber, limitNumber, Object.keys(filters).length > 0 ? filters : undefined);
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

export default withAudit(handler);

