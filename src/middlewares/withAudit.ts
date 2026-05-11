import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { AuditoriaRepository } from "@/infra/db/repositories/mongo/auditoria";
import { AuditoriaModel } from "@/domain/models/auditoria";

const auditoriaRepo = new AuditoriaRepository();

export const withAudit = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void | any>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const methodsToAudit = ["POST", "PUT", "DELETE", "PATCH"];

    if (!methodsToAudit.includes(req.method || "")) {
      return handler(req, res);
    }

    const session = await getServerSession(req, res, authOptions);

    const originalJson = res.json;
    const originalSend = res.send;
    const originalStatus = res.status;

    let responseBody: any;
    let statusCode = 200;

    // Sobrescreve status para capturar o código de resposta
    res.status = (code: number) => {
      statusCode = code;
      return originalStatus.call(res, code);
    };

    // Sobrescreve json para capturar o corpo da resposta
    res.json = (body: any) => {
      responseBody = body;
      return originalJson.call(res, body);
    };

    // Sobrescreve send para capturar o corpo da resposta (casos de strings/html)
    res.send = (body: any) => {
      responseBody = body;
      return originalSend.call(res, body);
    };

    try {
      await handler(req, res);

      // Log após execução bem sucedida do handler (mesmo que res.status tenha sido erro)
      const auditData: AuditoriaModel = {
        userId: (session?.user as any)?.id || (session?.user as any)?._id || "unknown",
        userName: session?.user?.name || "unknown",
        userEmail: session?.user?.email || "unknown",
        action: req.method || "UNKNOWN",
        path: req.url || "unknown",
        method: req.method || "UNKNOWN",
        requestBody: req.body,
        requestQuery: req.query,
        responseBody,
        statusCode,
        createdAt: new Date(),
      };

      if (statusCode >= 400) {
        auditData.error = responseBody?.error || responseBody?.message || "Erro na resposta";
      }

      await auditoriaRepo.create(auditData);

    } catch (error: any) {
      console.error("Erro capturado no withAudit:", error);

      const auditData: AuditoriaModel = {
        userId: (session?.user as any)?.id || (session?.user as any)?._id || "unknown",
        userName: session?.user?.name || "unknown",
        userEmail: session?.user?.email || "unknown",
        action: req.method || "UNKNOWN",
        path: req.url || "unknown",
        method: req.method || "UNKNOWN",
        requestBody: req.body,
        requestQuery: req.query,
        responseBody: { error: error.message },
        statusCode: 500,
        error: error.stack || error.message,
        createdAt: new Date(),
      };

      await auditoriaRepo.create(auditData);

      // Repassa o erro se não tiver sido respondido ainda
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
};
