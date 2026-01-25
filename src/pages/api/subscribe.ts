import { NextApiRequest, NextApiResponse } from "next";

// pages/api/subscribe.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const subscription = req.body;
    // Salvar subscription no banco
    res.status(201).json({});
  }
}
