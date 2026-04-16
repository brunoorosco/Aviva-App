import { NextApiRequest, NextApiResponse } from 'next';
import { addPagamentoService, removePagamentoService } from '@/services/reencontroComDeus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { reencontroId, redeId } = req.query;

    if (!reencontroId || typeof reencontroId !== 'string') {
      return res.status(400).json({ error: 'ID do reencontro é obrigatório' });
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
        reencontroId,
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
        reencontroId,
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
