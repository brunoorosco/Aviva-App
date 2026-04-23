import { NextApiRequest, NextApiResponse } from "next";
import { getPermissionsService, updateRolePermissionsService } from "@/services/permissions";
import { getServerSession } from "next-auth";
import { hasPermission, ROLES } from "@/lib/permissions";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !hasPermission(session.user.permission || [], [ROLES.ADMIN, ROLES.SECRETARIA])) {
    return res.status(403).json({ error: "Não autorizado" });
  }

  try {
    if (req.method === "GET") {
      const permissions = await getPermissionsService();
      return res.status(200).json(permissions);
    }

    if (req.method === "POST") {
      const { role, modules } = req.body;
      if (!role || !modules) {
        return res.status(400).json({ error: "Dados inválidos" });
      }
      const result = await updateRolePermissionsService(role, modules);
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Erro na API de permissões:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
