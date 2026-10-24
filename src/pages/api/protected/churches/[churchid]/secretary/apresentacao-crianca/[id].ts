import { withAudit } from '@/middlewares/withAudit';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { ApresentacaoMongoRepository } from '@/infra/db/repositories/mongo/apresentacao';
import { hasCriancaAccess } from '@/lib/hasCriancaAccess';

const repo = new ApresentacaoMongoRepository();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    if (!hasCriancaAccess(session)) {
      return res.status(403).json({ error: 'Você não tem acesso a Apresentação de Crianças' });
    }

    const churchId = req.query.churchid as string;
    const id = req.query.id as string;
    if (!churchId || typeof churchId !== 'string') {
      return res.status(400).json({ error: 'Invalid churchId' });
    }
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid id' });
    }

    if (req.method === 'GET') {
      const curso = await repo.getCursoCrianca(churchId, id);
      if (!curso) return res.status(404).json({ error: 'Curso não encontrado' });
      return res.status(200).json(curso);
    }

    if (req.method === 'DELETE') {
      const course = await repo.getCursoCrianca(churchId, id);
      if (!course) return res.status(404).json({ error: 'Curso não encontrado' });

      const result = await repo.deleteCursoCriancaCascade(churchId, id);
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Erro Apresentação de Crianças ([id]):', error);
    return res.status(500).json({ error: error?.message || 'Erro interno' });
  }
}

export default withAudit(handler);