import { NextApiRequest, NextApiResponse } from "next";
import { getConferenciaByIdService } from "@/services/conferencia";

const VALOR_PARTICIPANTE = 200;
const VALOR_EQUIPE = 100;

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
        const equipe = conferencia.equipe?.filter((m: any) => m.rede?._id === fin.rede._id) || [];

        const participantesIsentos = participantes.filter((p: any) => p.isento).length;
        const equipeIsentos = equipe.filter((m: any) => m.isento).length;

        const participantesNaoIsentos = participantes.length - participantesIsentos;
        const equipeNaoIsenta = equipe.length - equipeIsentos;

        const totalAPagar =
          participantesNaoIsentos * VALOR_PARTICIPANTE + equipeNaoIsenta * VALOR_EQUIPE;

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
          encontristas: participantes.length,
          encontristasIsentos: participantesIsentos,
          equipe: equipe.length,
          equipeIsentos,
          totalPago,
          totalAPagar,
          status,
          pagamentosPorTipo,
          pagamentos: pagamentosDetalhados,
        };
      });

      const totalEncontristas = grupos.reduce((s: number, g: any) => s + g.encontristas, 0);
      const totalEquipe = grupos.reduce((s: number, g: any) => s + g.equipe, 0);

      const pagamentosPorTipoGeral: Record<string, number> = {};
      grupos.forEach((g: any) => {
        Object.entries(g.pagamentosPorTipo).forEach(([tipo, valor]) => {
          pagamentosPorTipoGeral[tipo] = (pagamentosPorTipoGeral[tipo] || 0) + (valor as number);
        });
      });

      const totais = {
        totalEncontristas,
        totalEquipe,
        totalParticipantes: totalEncontristas + totalEquipe,
        totalIsentos: grupos.reduce(
          (s: number, g: any) => s + g.encontristasIsentos + g.equipeIsentos,
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
