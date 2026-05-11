import { withAudit } from '@/middlewares/withAudit';
import { createVisitantesService, getVisitantesService } from "@/services/visitantes";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { churchid, page = 1, limit = 10, name, dateStart, dateEnd } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    if (req.method == "POST") {
      const user = await createVisitantesService(req.body, churchid as string);
      res.status(201).json({ user });
    } else if (req.method == "GET") {
      const filters = {
        name: name as string,
        dateStart: dateStart as string,
        dateEnd: dateEnd as string,
      };
      
      // Remove campos vazios
      Object.keys(filters).forEach(key => {
        if (!filters[key as keyof typeof filters]) {
          delete filters[key as keyof typeof filters];
        }
      });
      
      const batismo = await getVisitantesService(churchid as string, pageNumber, limitNumber, Object.keys(filters).length > 0 ? filters : undefined);
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

export default withAudit(handler);