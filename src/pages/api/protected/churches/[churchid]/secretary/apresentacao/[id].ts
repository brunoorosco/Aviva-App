import { withAudit } from '@/middlewares/withAudit';
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ApresentacaoMongoRepository } from "@/infra/db/repositories/mongo/apresentacao";
import { getRedeName } from "@/utils/helpersNameREde";

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

        if (req.method === 'DELETE') {
            const apresentacao = await apresentacaoRepo.getApresentacaoById(churchId, apresentacaoId);
            if (!apresentacao) {
                return res.status(404).json({ error: "Not found" });
            }

            // @ts-ignore
            const role = (session.user.role || '').toLowerCase();
            const isAdmin = role === 'admin';

            if (!isAdmin && role !== 'supervisor' && role !== 'pastor') {
                return res.status(403).json({ error: "Você não tem permissão para remover apresentações." });
            }

            if (!isAdmin) {
                // @ts-ignore
                const userCemName = (session.user.cem?.name || '').toUpperCase();
                const redeName = getRedeName(apresentacao.rede).toUpperCase();

                if (!userCemName || redeName !== userCemName) {
                    return res.status(403).json({ error: "Você só pode remover pessoas da sua própria rede." });
                }
            }

            await apresentacaoRepo.deleteApresentacao(churchId, apresentacaoId);
            return res.status(200).json({ message: "Apresentação removida com sucesso." });
        }

        return res.status(405).json({ error: "Method not allowed" });

    } catch (error) {
        console.error("Error managing apresentacao:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default withAudit(handler);