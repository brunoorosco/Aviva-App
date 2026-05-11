import { deleteCasaCemsService } from "@/services/cems";
import { NextApiRequest, NextApiResponse } from "next";
import { withAudit } from "@/middlewares/withAudit";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    const cemId = (req.query?.id as string) || "";

    if (req.method == "PUT") {
      const casa = await deleteCasaCemsService({ casaId: req.body.casaId, cemId, churchId });
      res.status(200).json({ casa });
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

