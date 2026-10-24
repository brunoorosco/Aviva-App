import { withAudit } from '@/middlewares/withAudit';
import { getServerSession } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { changeUserPermissionByEmail } from '@/services/users';
import { isAdminUser } from '@/lib/isAdminUser';

// Troca a permissão `apresentacao_crianca` (grant/revoke) sem mexer em senha.
// Segurança: exige adminUser (role admin/bispo OU perm 'admin').
// Body: { emails: "a@x.com,b@y.com", permission: "apresentacao_crianca", action: "grant"|"revoke" }
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!isAdminUser(session)) {
      return res.status(403).json({ error: 'Acesso restrito' });
    }

    if (req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { emails, permission, action } = (req.body || {}) as {
      emails?: string;
      permission?: string;
      action?: 'grant' | 'revoke';
    };

    if (!emails || !permission) {
      return res.status(400).json({ error: 'emails e permission são obrigatórios' });
    }
    if (action !== 'grant' && action !== 'revoke') {
      return res.status(400).json({ error: "action inválida (use 'grant' ou 'revoke')" });
    }

    const resp = await changeUserPermissionByEmail({ emails, permission, action });
    const { status, ...data } = resp;
    return res.status(status).json(data);
  } catch (error: any) {
    console.error('Erro ao alterar permissões:', error);
    return res.status(500).json({ error: error?.message || 'Erro interno' });
  }
}

export default withAudit(handler);