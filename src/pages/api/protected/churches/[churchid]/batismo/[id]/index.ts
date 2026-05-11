import { withAudit } from '@/middlewares/withAudit';
import { getBatismoByIdService, addBatizandoService, removeBatizandoService } from '@/services/batismos'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
      const { nome, rede, sexo } = req.body
      const userRede = session.user.cem?.name || ''
      const isAdmin = session.user.role?.toLowerCase() === 'bispo' || session.user.role?.toLowerCase() === 'admin'

      const finalRede = isAdmin ? rede : userRede

      if (!finalRede) {
        return res.status(400).json({ error: 'Rede é obrigatória' })
      }

      await addBatizandoService(id, { nome, rede: finalRede, sexo })
      return res.status(201).json({ message: 'Batizando adicionado com sucesso' })
    }

    if (req.method === 'DELETE') {
      // Remover batizando
      const { nome, rede } = req.body || req.query
      const userRede = session.user.cem?.name || ''
      const isAdmin = session.user.role?.toLowerCase() === 'bispo' || session.user.role?.toLowerCase() === 'admin'

      if (!isAdmin && rede !== userRede) {
        return res.status(403).json({ error: 'Você só pode excluir batizandos da sua própria rede' })
      }

      await removeBatizandoService(id, nome as string, rede as string)
      return res.status(200).json({ message: 'Batizando removido com sucesso' })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('[BAPTISM_ID_API_ERROR]:', error)
    res.status(500).json({ error: 'Erro interno ao processar solicitação' })
  }
}

export default withAudit(handler);