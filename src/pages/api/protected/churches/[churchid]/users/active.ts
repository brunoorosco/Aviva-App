import type { NextApiRequest, NextApiResponse } from "next";
import { UsersMongoRepository } from "@/infra/db/repositories/mongo/users";

type Error = {
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<
        | {
            _id: string;
            name: string;
            email: string;
            role: string;
            rede: { name: string; _id: string } | null;
        }[]
        | Error
    >,
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const churchId = req.query.churchid as string;

        if (!churchId) {
            return res.status(400).json({ message: "Missing required parameter: churchid" });
        }

        const repository = new UsersMongoRepository();
        const users = await repository.getAllActiveUsersWithNetwork(churchId);

        return res.status(200).json(users);
    } catch (error: any) {
        console.error("Error fetching active users:", error);
        return res.status(500).json({ message: error.message || "Erro ao buscar usuários ativos" });
    }
}
