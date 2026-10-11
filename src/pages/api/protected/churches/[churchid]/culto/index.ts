import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { withAudit } from '@/middlewares/withAudit'
import { CultoSettingsMongoRepository } from '@/infra/db/repositories/mongo/cultoSettings'
import { CultoSettingsService } from '@/services/cultoSettingsService'
import { UsersMongoRepository } from '@/infra/db/repositories/mongo/users'
import { isAdminUser } from '@/lib/isAdminUser'
import { CultoDomingo } from '@/domain/models/cultoSettings'

const repo = new CultoSettingsMongoRepository()
const service = new CultoSettingsService(repo)
const usersRepo = new UsersMongoRepository()

const VALID: CultoDomingo[] = ['manha', 'noite', 'manha_e_noite']

/**
 * Resolve o status de admin do usuário atual.
 * 1. Tenta pela session (role/permission).
 * 2. Se nada vier da session (JWT antigo/desatualizado), relê do banco pelo e-mail.
 */
async function resolveAdmin(session: any): Promise<{ isAdmin: boolean; debug: { role?: string; permission?: string[] } }> {
  if (isAdminUser(session)) {
    return {
      isAdmin: true,
      debug: {
        role: session?.user?.role,
        permission: session?.user?.permission,
      },
    }
  }

  // Sessão sem sinais de admin — tenta o banco (cobre promoção recente / JWT stale).
  const email = session?.user?.email
  if (email) {
    try {
      const db = await usersRepo.getByEmail(email)
      if (db) {
        return {
          isAdmin: isAdminUser({ user: db }),
          debug: { role: db?.role, permission: db?.permission },
        }
      }
    } catch (e) {
      console.error('resolveAdmin: falha ao buscar no banco', e)
    }
  }

  return {
    isAdmin: false,
    debug: {
      role: session?.user?.role,
      permission: session?.user?.permission,
    },
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const churchId = req.query.churchid as string
  if (!churchId || typeof churchId !== 'string') {
    return res.status(400).json({ error: 'Invalid churchId' })
  }

  if (req.method === 'GET') {
    try {
      const cultoDomingo = await service.getCultoDomingo(churchId)
      return res.status(200).json({ cultoDomingo })
    } catch (err: any) {
      console.error('Erro ao buscar cultoDomingo:', err)
      return res.status(500).json({ error: err.message || 'Erro ao buscar configuração' })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const { isAdmin, debug } = await resolveAdmin(session)
      if (!isAdmin) {
        return res.status(403).json({
          error: 'Apenas administradores podem alterar essa configuração.',
          debug,
        })
      }

      const body = (req.body || {}) as { cultoDomingo?: CultoDomingo }
      const value = body?.cultoDomingo
      if (!value || !VALID.includes(value)) {
        return res.status(400).json({ error: 'cultoDomingo inválido. Use: manha | noite | manha_e_noite' })
      }

      await service.saveCultoDomingo(churchId, value)
      return res.status(200).json({ ok: true, cultoDomingo: value })
    } catch (err: any) {
      console.error('Erro ao salvar cultoDomingo:', err)
      return res.status(500).json({ error: err.message || 'Erro ao salvar configuração' })
    }
  }

  return res.status(405).end()
}

export default withAudit(handler)