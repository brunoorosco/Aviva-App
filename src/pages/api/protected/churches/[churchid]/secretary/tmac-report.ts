import { EncontroComDeusRepository } from "@/infra/db/repositories/mongo/encontroComDeus";
import { CasasDePazRepository } from "@/infra/db/repositories/mongo/casasDePaz";
import { VisitasDePazRepository } from "@/infra/db/repositories/mongo/visitasDePaz";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const churchId = (req.query?.churchid as string) || "";
        const year = (req.query?.year as string) || new Date().getFullYear().toString();

        if (req.method == "GET") {
            const repository = new EncontroComDeusRepository();
            const casasRepo = new CasasDePazRepository();
            const visitasRepo = new VisitasDePazRepository();

            const [reportData, casasData, visitasData] = await Promise.all([
                repository.fechamentoAnual(year),
                casasRepo.getAnalytics(year, churchId),
                visitasRepo.getAnalytics(year, churchId)
            ]);

            // If no data found for the year, return zeroed structure
            const safeData = {
                encontro: (reportData && reportData[0]) || {
                    totalAnual: 0,
                    totaisPorRede: [],
                    totaisPorIgreja: [],
                    encontros: [],
                },
                casasDePaz: casasData || [],
                visitasDePaz: visitasData || []
            };

            res.status(200).json(safeData);
        } else {
            res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("Error fetching TMAC report:", error);
        //@ts-ignore
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};
