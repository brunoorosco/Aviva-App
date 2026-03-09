import { NextApiRequest, NextApiResponse } from "next";
import { getEncontroComDeusByIdService } from "@/services/encontroComDeus";

const VALOR_ENCONTRISTA = 200;
const VALOR_EQUIPE = 100;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const encontroId = req.query?.id as string;
    if (req.method === "GET") {
      // Buscar encontro com todos os dados
      const encontro = await getEncontroComDeusByIdService("", encontroId);

      if (!encontro) {
        return res.status(404).json({ error: "Encontro não encontrado" });
      }

      // Agrupar dados por rede para o relatório financeiro
      const financeiroPorRede = encontro.financeiro || [];

      // // Montar estrutura de dados para o relatório
      // const grupos = financeiroPorRede.map((fin: any) => {
      //   const encontristas =
      //     encontro.encontristas?.filter((e: any) => e.rede?._id === fin.rede._id) || [];
      //   const equipe = encontro.equipe?.filter((e: any) => e.rede?._id === fin.rede._id) || [];

      //   // Contar encontristas isentos
      //   const encontristasIsentos = encontristas.filter((e: any) => e.isento).length;

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
      //     encontristas: encontristas.length,
      //     encontristasIsentos,
      //     equipe: equipe.length,
      //     equipeIsentos,
      //     totalPago: fin.totalPago || 0,
      //     totalAPagar: fin.totalAPagar || 0,
      //     status: fin.status,
      //     pagamentosPorTipo,
      //   };
      // });

      const grupos = financeiroPorRede.map((fin: any) => {
  const encontristas =
    encontro.encontristas?.filter((e: any) => e.rede?._id === fin.rede._id) || [];
  const equipe = encontro.equipe?.filter((e: any) => e.rede?._id === fin.rede._id) || [];

  const encontristasIsentos = encontristas.filter((e: any) => e.isento).length;
  const equipeIsentos = equipe.filter((e: any) => e.isento).length;

  // Calcular não-isentos
  const encontristasNaoIsentos = encontristas.length - encontristasIsentos;
  const equipeNaoIsenta = equipe.length - equipeIsentos;

  // totalAPagar = apenas não-isentos × valor respectivo
  const totalAPagar =
    encontristasNaoIsentos * VALOR_ENCONTRISTA + equipeNaoIsenta * VALOR_EQUIPE;

  const pagamentosPorTipo: Record<string, number> = {};
  (fin.pagamento || []).forEach((p: any) => {
    pagamentosPorTipo[p.tipo] = (pagamentosPorTipo[p.tipo] || 0) + p.valor;
  });

  return {
    id: fin._id,
    nome: fin.rede.name,
    celula: fin.rede.name,
    encontristas: encontristas.length,
    encontristasIsentos,
    equipe: equipe.length,
    equipeIsentos,
    totalPago: fin.totalPago || 0,
    totalAPagar, // ✅ recalculado aqui, ignorando o valor do banco
    status: fin.status,
    pagamentosPorTipo,
  };
});
      // Calcular totais gerais
      const totalEncontristas = grupos.reduce((s: number, g: any) => s + g.encontristas, 0);
      const totalEquipe = grupos.reduce((s: number, g: any) => s + g.equipe, 0);

      // Agregar todos os pagamentos por tipo
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
          0,
        ),
        totalPago: grupos.reduce((s: number, g: any) => s + g.totalPago, 0),
        totalAPagar: grupos.reduce((s: number, g: any) => s + g.totalAPagar, 0),
        pagamentosPorTipoGeral,
      };

      const response = {
        encontro: {
          _id: encontro._id,
          numero: encontro.numero,
          data: encontro.data,
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
