import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ApresentacaoMongoRepository } from "@/infra/db/repositories/mongo/apresentacao";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const churchId = req.query.churchid as string;
        const apresentacaoRepo = new ApresentacaoMongoRepository();

        if (req.method === 'GET') {
            const apresentacoes = await apresentacaoRepo.getApresentacoes(churchId);
            return res.status(200).json(apresentacoes);
        }

        if (req.method === 'POST') {
            console.log('BODY:', req.body);
            const data = req.body;
            // Basic Validation could go here
            if (!data.tipo || !data.dataApresentacao || !data.horario) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const result = await apresentacaoRepo.addApresentacao(churchId, data);
            console.log('RESULT:', result);
            return res.status(201).json(result);
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }

    } catch (error) {
        console.error("Error saving apresentacao:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
