import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getUserSettings } from "@/services/users";
import { DiscipuladoMongoRepository } from "@/infra/db/repositories/mongo/discipulado";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  const { userid } = req.query;

  // Garantir que o usuário só acessa o próprio perfil, a menos que seja admin/secretaria
  const isSelf = session.user.id === userid;
  const isAdmin = session.user.permission?.includes("admin") || session.user.permission?.includes("secretaria");

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ message: "Acesso negado" });
  }

  if (req.method === "GET") {
    try {
      const userRepo = await getUserSettings(userid as string);
      const discipuladoRepo = new DiscipuladoMongoRepository();
      
      // Buscar aulas do discipulado para ver presenças
      const todasAulas = await discipuladoRepo.getAulasByCicloId();
      
      const presencasDiscipulado = todasAulas.map(aula => {
        const presenca = aula.alunos?.find(aluno => aluno.membroId === userid);
        return {
          tema: aula.tema,
          data: aula.data,
          presente: !!presenca?.presente
        };
      });

      // Calcular desempenho
      const totalAulas = presencasDiscipulado.length;
      const totalPresencas = presencasDiscipulado.filter(p => p.presente).length;
      const aproveitamento = totalAulas > 0 ? Math.round((totalPresencas / totalAulas) * 100) : 0;

      return res.status(200).json({
        user: userRepo,
        performance: {
          discipulado: {
            aulas: presencasDiscipulado,
            aproveitamento
          },
          jornada: {
            encontroComDeus: userRepo.encontroComDeus || false,
            reencontroComDeus: userRepo.reencontroComDeus || false,
            batizado: userRepo.batizado || false,
            escolaProfeta: userRepo.escolaProfeta || false,
            sejaLivre: userRepo.sejaLivre || false
          }
        }
      });
    } catch (error) {
      console.error("Erro ao buscar desempenho:", error);
      return res.status(500).json({ message: "Erro ao buscar dados" });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}
