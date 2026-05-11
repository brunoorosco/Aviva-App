import { withAudit } from '@/middlewares/withAudit';
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ApresentacaoMongoRepository } from "@/infra/db/repositories/mongo/apresentacao";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const churchId = req.query.churchid as string;
        const apresentacaoId = req.query.id as string;
        const apresentacaoRepo = new ApresentacaoMongoRepository();

        if (req.method === 'GET') {
            const apresentacao = await apresentacaoRepo.getApresentacaoById(churchId, apresentacaoId);
            if (!apresentacao) {
                return res.status(404).json({ error: "Not found" });
            }
            return res.status(200).json(apresentacao);
        }

        if (req.method === 'PUT') {
            const data = req.body;
            // update requires the _id to match
            const result = await apresentacaoRepo.updateApresentacao(churchId, { _id: apresentacaoId, ...data });
            return res.status(200).json(result);
        }

        return res.status(405).json({ error: "Method not allowed" });

    } catch (error) {
        console.error("Error managing apresentacao:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default withAudit(handler);