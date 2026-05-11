import { withAudit } from '@/middlewares/withAudit';
import { NextApiRequest, NextApiResponse } from 'next';
import { addPagamentoService, removePagamentoService } from '@/services/encontroComDeus';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { encontroId, redeId } = req.query;

    if (!encontroId || typeof encontroId !== 'string') {
      return res.status(400).json({ error: 'ID do encontro é obrigatório' });
    }

    if (!redeId || typeof redeId !== 'string') {
      return res.status(400).json({ error: 'ID da rede é obrigatório' });
    }

    // POST - Adicionar pagamento
    if (req.method === 'POST') {
      const { tipo, valor, comprovanteUrl, comprovanteName } = req.body;

      if (!tipo || !valor) {
        return res.status(400).json({ error: 'Tipo e valor são obrigatórios' });
      }

      const result = await addPagamentoService({
        encontroId,
        redeId,
        pagamento: {
          tipo,
          valor,
          comprovanteUrl,
          comprovanteName,
          createdAt: new Date().toISOString()
        }
      });

      return res.status(201).json({
        message: 'Pagamento adicionado com sucesso',
        result
      });
    }

    // DELETE - Remover pagamento
    if (req.method === 'DELETE') {
      const { pagamentoId } = req.body;

      if (!pagamentoId) {
        return res.status(400).json({ error: 'ID do pagamento é obrigatório' });
      }

      const result = await removePagamentoService({
        encontroId,
        redeId,
        pagamentoId
      });

      return res.status(200).json({
        message: 'Pagamento removido com sucesso',
        result
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro na rota de pagamento:', error);
    return res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
}

export default withAudit(handler);