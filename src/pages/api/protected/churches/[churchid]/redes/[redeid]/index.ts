import type { NextApiRequest, NextApiResponse } from "next";
import { deleteCemService, getCemByIdService, updateCemService } from "@/services/cemService";

interface Error {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any | null>) {
  const churchId = req.query.churchid as string;
  const cemId = req.query.redeid as string;

  if (req.method == "GET") {
    const cem = await getCemByIdService(churchId, cemId);
    return res.status(200).json(cem);
  } else if (req.method == "DELETE") {
    const cemDelete = await deleteCemService(churchId, cemId);
    return res.status(200).json(cemDelete);
  } else if (req.method == "PUT") {
    const saved = await updateCemService(churchId, cemId, req.body);
    return res.status(200).json(saved);
  } else {
    return res.status(404);
  }
  // if (!cem) {
  //   return res.status(400).json({ message: `CEM [${cemId}] not found.` })
  // }
}
