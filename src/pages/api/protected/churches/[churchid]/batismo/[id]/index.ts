import { withAudit } from '@/middlewares/withAudit';
import { getBatismoByIdService, addBatizandoService, removeBatizandoService } from '@/services/batismos'
import { updateMemberBaptismStatus } from '@/services/members'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

// data_batismo fica às 00:00 no fuso UTC-3 (America/Sao_Paulo),
// para que a exibição dd/mm/yyyy não desloque o dia.
function buildDataBatismo(data: any): Date {
  const date = data instanceof Date ? data : new Date(data)
  if (!(date instanceof Date) || isNaN(date.getTime())) return new Date()
  const y = date.getUTCFullYear() || 1970
  const m = date.getUTCMonth() || 0
  const d = date.getUTCDate() || 1
  return new Date(Date.UTC(y, m, d, 3))
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { churchid, id } = req.query as { churchid: string, id: string }

  try {
    if (req.method === 'GET') {
      const batismo = await getBatismoByIdService(churchid, id)
      if (!batismo) return res.status(404).json({ error: 'Batismo não encontrado' })
      return res.status(200).json(batismo)
    }

    if (req.method === 'POST') {
      // Adicionar batizando
      const { nome, rede, sexo, userId } = req.body
      const userRede = session.user.cem?.name || ''
      const isAdmin = session.user.role?.toLowerCase() === 'bispo' || session.user.role?.toLowerCase() === 'admin'

      const finalRede = isAdmin ? rede : userRede

      if (!finalRede) {
        return res.status(400).json({ error: 'Rede é obrigatória' })
      }

      await addBatizandoService(id, { nome, rede: finalRede, sexo, userId })

      if (userId) {
        const batismo = await getBatismoByIdService(churchid, id)
        await updateMemberBaptismStatus(userId, {
          batizado: true,
          dataBatismo: batismo?.data ? buildDataBatismo(batismo.data) : null,
          sexo
        })
      }

      return res.status(201).json({ message: 'Batizando adicionado com sucesso' })
    }

    if (req.method === 'DELETE') {
      // Remover batizando
      const { nome: reqNome, userId: reqUserId } = req.body || req.query
      const userRede = session.user.cem?.name || ''
      const isAdmin = session.user.role?.toLowerCase() === 'bispo' || session.user.role?.toLowerCase() === 'admin'

      // Resolve o batizando a partir do que está gravado no banco (não do que foi
      // enviado pelo cliente), garantindo que uma rede/envio desatualizado não
      // quebre a exclusão logo após uma adição otimista.
      const batismo = await getBatismoByIdService(churchid, id)
      const normalizedNome = String(reqNome || '').trim().toUpperCase()
      const matches = (batismo?.batizandos || []).filter(
        (p: any) => p.nome?.trim().toUpperCase() === normalizedNome
      )
      const target = reqUserId
        ? matches.find((p: any) => p.userId === reqUserId) || matches[0]
        : matches.find((p: any) => !p.userId) || matches[0]

      // Exclusão idempotente: se o batizando não existe mais, responde sucesso.
      if (!target) {
        return res.status(200).json({ message: 'Batizando removido com sucesso' })
      }

      const storedUserId: string | null = target.userId || reqUserId || null

      if (!isAdmin && target.rede !== userRede) {
        return res.status(403).json({ error: 'Você só pode excluir batizandos da sua própria rede' })
      }

      await removeBatizandoService(id, target.nome as string, target.rede as string, storedUserId || undefined)

      if (storedUserId) {
        await updateMemberBaptismStatus(storedUserId, {
          batizado: false,
          dataBatismo: null
        })
      }

      return res.status(200).json({ message: 'Batizando removido com sucesso' })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('[BAPTISM_ID_API_ERROR]:', error)
    res.status(500).json({ error: 'Erro interno ao processar solicitação' })
  }
}

export default withAudit(handler);