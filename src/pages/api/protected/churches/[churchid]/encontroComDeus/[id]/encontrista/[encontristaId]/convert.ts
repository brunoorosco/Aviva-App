import { convertToMemberService } from "@/services/encontroComDeus";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const churchId = (req.query?.churchid as string) || "";
    const encontroId = (req.query?.id as string) || "";
    const encontristaId = (req.query?.encontristaId as string) || "";

    if (req.method === "POST") {
      const result = await convertToMemberService(churchId, encontroId, encontristaId);
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Error converting encontrista to member:", error);
    res.status(400).json({ error: error.message || "Erro ao converter para membro" });
  }
};
