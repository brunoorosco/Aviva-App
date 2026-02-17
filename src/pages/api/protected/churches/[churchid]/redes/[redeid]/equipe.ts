import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/domain/models/users";
import { usersByCemEquipe } from "@/services/users";

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | User | Error | { _id: string; name: string }[]>,
) {
  if (req.method === "GET") {
    const { redeid } = req.query;

    const members = await usersByCemEquipe(redeid as string);
    return res.status(200).json(members);
  }
  return res.status(400);
}
