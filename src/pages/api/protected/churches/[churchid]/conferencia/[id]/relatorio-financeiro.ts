import { NextApiRequest, NextApiResponse } from "next";
import { getConferenciaByIdService } from "@/services/conferencia";

const VALOR_INSCRICAO = 50;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const conferenciaId = req.query?.id as string;

    if (req.method === "GET") {
      const conferencia = await getConferenciaByIdService("", conferenciaId);

      if (!conferencia) {
        return res.status(404).json({ error: "Conferência não encontrada" });
      }

      const financeiroPorRede = conferencia.financeiro || [];

      const grupos = financeiroPorRede.map((fin: any) => {
        const participantes =
          conferencia.participantes?.filter((p: any) => p.rede?._id === fin.rede._id) || [];

        const participantesIsentos = participantes.filter((p: any) => p.isento).length;
        const participantesNaoIsentos = participantes.length - participantesIsentos;

        const totalAPagar = participantesNaoIsentos * VALOR_INSCRICAO;

        const pagamentosPorTipo: Record<string, number> = {};
        (fin.pagamento || []).forEach((p: any) => {
          pagamentosPorTipo[p.tipo] = (pagamentosPorTipo[p.tipo] || 0) + p.valor;
        });

        const totalPago = (fin.pagamento || []).reduce(
          (sum: number, p: any) => sum + p.valor,
          0
        );

        let status: "quitado" | "parcial" | "pendente" | "excedente";
        if (totalPago === 0) status = "pendente";
        else if (totalPago === totalAPagar) status = "quitado";
        else if (totalPago > totalAPagar) status = "excedente";
        else status = "parcial";

        const pagamentosDetalhados = (fin.pagamento || []).map((p: any) => ({
          _id: p._id,
          tipo: p.tipo,
          valor: p.valor,
          data: p.data || p.createdAt,
          comprovanteUrl: p.comprovanteUrl,
          comprovanteName: p.comprovanteName,
        }));

        return {
          id: fin._id,
          nome: fin.rede.name,
          celula: fin.rede.name,
          participantes: participantes.length,
          participantesIsentos,
          totalPago,
          totalAPagar,
          status,
          pagamentosPorTipo,
          pagamentos: pagamentosDetalhados,
        };
      });

      const totalParticipantes = grupos.reduce((s: number, g: any) => s + g.participantes, 0);

      const pagamentosPorTipoGeral: Record<string, number> = {};
      grupos.forEach((g: any) => {
        Object.entries(g.pagamentosPorTipo).forEach(([tipo, valor]) => {
          pagamentosPorTipoGeral[tipo] = (pagamentosPorTipoGeral[tipo] || 0) + (valor as number);
        });
      });

      const totais = {
        totalParticipantes,
        totalIsentos: grupos.reduce(
          (s: number, g: any) => s + g.participantesIsentos,
          0
        ),
        totalPago: grupos.reduce((s: number, g: any) => s + g.totalPago, 0),
        totalAPagar: grupos.reduce((s: number, g: any) => s + g.totalAPagar, 0),
        pagamentosPorTipoGeral,
      };

      const response = {
        conferencia: {
          _id: conferencia._id,
          numero: conferencia.numero,
          data: conferencia.data,
          descricao: conferencia.descricao,
        },
        grupos,
        totais,
      };

      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      return res.status(200).json(response);
    } else {
      return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro ao buscar relatório financeiro da conferência:", error);
    return res.status(500).json({ error: "Erro ao buscar relatório financeiro" });
  }
};
