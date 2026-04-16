import { NextApiRequest, NextApiResponse } from "next";
import { getReencontroComDeusByIdService } from "@/services/reencontroComDeus";

const VALOR_REENCONTRISTA = 200;
const VALOR_EQUIPE = 100;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const reencontroId = req.query?.id as string;
    if (req.method === "GET") {
      // Buscar reencontro com todos os dados
      const reencontro = await getReencontroComDeusByIdService("", reencontroId);

      if (!reencontro) {
        return res.status(404).json({ error: "Reencontro não encontrado" });
      }

      // Agrupar dados por rede para o relatório financeiro
      const financeiroPorRede = reencontro.financeiro || [];

      // // Montar estrutura de dados para o relatório
      // const grupos = financeiroPorRede.map((fin: any) => {
      //   const reencontristas =
      //     reencontro.reencontristas?.filter((e: any) => e.rede?._id === fin.rede._id) || [];
      //   const equipe = reencontro.equipe?.filter((e: any) => e.rede?._id === fin.rede._id) || [];

      //   // Contar reencontristas isentos
      //   const reencontristasIsentos = reencontristas.filter((e: any) => e.isento).length;

      //   // Contar equipe isenta
      //   const equipeIsentos = equipe.filter((e: any) => e.isento).length;

      //   // Agrupar pagamentos por tipo
      //   const pagamentosPorTipo: Record<string, number> = {};
      //   (fin.pagamento || []).forEach((p: any) => {
      //     pagamentosPorTipo[p.tipo] = (pagamentosPorTipo[p.tipo] || 0) + p.valor;
      //   });

      //   return {
      //     id: fin._id,
      //     nome: fin.rede.name,
      //     celula: fin.rede.name, // Usando o nome da rede como célula
      //     reencontristas: reencontristas.length,
      //     reencontristasIsentos,
      //     equipe: equipe.length,
      //     equipeIsentos,
      //     totalPago: fin.totalPago || 0,
      //     totalAPagar: fin.totalAPagar || 0,
      //     status: fin.status,
      //     pagamentosPorTipo,
      //   };
      // });

      const grupos = financeiroPorRede.map((fin: any) => {
        const reencontristas =
          reencontro.reencontristas?.filter((e: any) => e.rede?._id === fin.rede._id) || [];
        const equipe = reencontro.equipe?.filter((e: any) => e.rede?._id === fin.rede._id) || [];

        const reencontristasIsentos = reencontristas.filter((e: any) => e.isento).length;
        const equipeIsentos = equipe.filter((e: any) => e.isento).length;

        // Calcular não-isentos
        const reencontristasNaoIsentos = reencontristas.length - reencontristasIsentos;
        const equipeNaoIsenta = equipe.length - equipeIsentos;

        // totalAPagar = apenas não-isentos × valor respectivo
        const totalAPagar =
          reencontristasNaoIsentos * VALOR_REENCONTRISTA + equipeNaoIsenta * VALOR_EQUIPE;

        const pagamentosPorTipo: Record<string, number> = {};
        (fin.pagamento || []).forEach((p: any) => {
          pagamentosPorTipo[p.tipo] = (pagamentosPorTipo[p.tipo] || 0) + p.valor;
        });

        // Calcular total pago somando todos os pagamentos
        const totalPago = (fin.pagamento || []).reduce((sum: number, p: any) => sum + p.valor, 0);

        // Calcular status baseado nos valores reais dos pagamentos
        let status: "quitado" | "parcial" | "pendente" | "excedente";
        if (totalPago === 0) {
          status = "pendente";
        } else if (totalPago === totalAPagar) {
          status = "quitado";
        } else if (totalPago > totalAPagar) {
          status = "excedente";
        } else {
          status = "parcial";
        }

        // Mapear pagamentos com detalhes dos comprovantes
        const pagamentosDetalhados = (fin.pagamento || []).map((p: any) => ({
          _id: p._id,
          tipo: p.tipo,
          valor: p.valor,
          data: p.createdAt,
          comprovanteUrl: p.comprovanteUrl,
          comprovanteName: p.comprovanteName,
        }));

        return {
          id: fin._id,
          nome: fin.rede.name,
          celula: fin.rede.name,
          reencontristas: reencontristas.length,
          reencontristasIsentos,
          equipe: equipe.length,
          equipeIsentos,
          totalPago, // ✅ recalculado baseado nos pagamentos
          totalAPagar, // ✅ recalculado aqui, ignorando o valor do banco
          status, // ✅ calculado dinamicamente
          pagamentosPorTipo,
          pagamentos: pagamentosDetalhados,
        };
      });
      // Calcular totais gerais
      const totalReencontristas = grupos.reduce((s: number, g: any) => s + g.reencontristas, 0);
      const totalEquipe = grupos.reduce((s: number, g: any) => s + g.equipe, 0);

      // Agregar todos os pagamentos por tipo
      const pagamentosPorTipoGeral: Record<string, number> = {};
      grupos.forEach((g: any) => {
        Object.entries(g.pagamentosPorTipo).forEach(([tipo, valor]) => {
          pagamentosPorTipoGeral[tipo] = (pagamentosPorTipoGeral[tipo] || 0) + (valor as number);
        });
      });

      const totais = {
        totalReencontristas,
        totalEquipe,
        totalParticipantes: totalReencontristas + totalEquipe,
        totalIsentos: grupos.reduce(
          (s: number, g: any) => s + g.reencontristasIsentos + g.equipeIsentos,
          0,
        ),
        totalPago: grupos.reduce((s: number, g: any) => s + g.totalPago, 0),
        totalAPagar: grupos.reduce((s: number, g: any) => s + g.totalAPagar, 0),
        pagamentosPorTipoGeral,
      };

      const response = {
        reencontro: {
          _id: reencontro._id,
          numero: reencontro.numero,
          data: reencontro.data,
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
    console.error("Erro ao buscar relatório financeiro:", error);
    return res.status(500).json({ error: "Erro ao buscar relatório financeiro" });
  }
};
