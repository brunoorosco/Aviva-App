import { withAudit } from '@/middlewares/withAudit';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { ApresentacaoMongoRepository } from '@/infra/db/repositories/mongo/apresentacao';
import { cursoCriancaService, validateCursoDates } from '@/services/cursosCrianca';
import { hasCriancaAccess } from '@/lib/hasCriancaAccess';
import { TCriancaItem } from '@/domain/models/apresentacao';

const repo = new ApresentacaoMongoRepository();

function isValidationError(msg: string): boolean {
  if (!msg) return false;
  const m = msg.toLowerCase();
  return (
    m.includes('obrigat') ||
    m.includes('inválid') ||
    m.includes('depois da data do curso') ||
    m.includes('precisa') ||
    m.includes('ao menos uma criança')
  );
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    if (!hasCriancaAccess(session)) {
      return res.status(403).json({ error: 'Você não tem acesso a Apresentação de Crianças' });
    }

    const churchId = req.query.churchid as string;
    if (!churchId || typeof churchId !== 'string') {
      return res.status(400).json({ error: 'Invalid churchId' });
    }

    if (req.method === 'GET') {
      const cursos = await repo.getTodosCursoCrianca(churchId);
      return res.status(200).json(cursos);
    }

    if (req.method === 'POST') {
      const { dataCurso, dataApresentacao, horario, items } = (req.body || {}) as {
        dataCurso?: string;
        dataApresentacao?: string;
        horario?: 'manha' | 'noite';
        items?: TCriancaItem[];
      };

      const dateError = validateCursoDates(dataCurso || '', dataApresentacao || '');
      if (dateError) return res.status(400).json({ error: dateError });

      if (horario !== 'manha' && horario !== 'noite') {
        return res.status(400).json({ error: "horario inválido (use 'manha' ou 'noite')" });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Informe ao menos uma criança' });
      }

      //@ts-ignore
      const user = session.user;
      const result = await cursoCriancaService.createCurso({
        churchId,
        dataCurso: dataCurso!,
        dataApresentacao: dataApresentacao!,
        horario,
        items,
        criadoPor: {
          _id: (user?.id || user?.name || '').toString(),
          name: (user?.name || '').toString(),
        },
      });

      return res.status(201).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Erro Apresentação de Crianças (index):', error);
    const msg = error?.message || 'Erro interno';
    const status = isValidationError(msg) ? 400 : 500;
    return res.status(status).json({ error: msg });
  }
}

export default withAudit(handler);