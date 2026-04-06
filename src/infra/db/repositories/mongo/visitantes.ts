import {
  TMonthlyVisitor,
  TVisitorBySource,
  TVisitorCountResponse,
  TVisitorSource,
  VisitantesModel,
} from "@/domain/models/visitantes";
import { endOfDay, startOfDay } from "date-fns";
import { MongoHelper } from "../../mongoHelper";

export class VisitantesRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = "visitantes";
  }

  async getVisitantes(churchId: string, page: number = 1, limit: number = 10, filters?: {
    name?: string;
    dateStart?: string;
    dateEnd?: string;
  }) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const skip = (page - 1) * limit;

    // Construir filtro para MongoDB
    const mongoFilter: any = { churchId };

    if (filters?.name) {
      mongoFilter.name = { $regex: filters.name, $options: "i" };
    }

    if (filters?.dateStart || filters?.dateEnd) {
      mongoFilter.visitedAt = {};
      if (filters.dateStart) {
        mongoFilter.visitedAt.$gte = new Date(filters.dateStart);
      }
      if (filters.dateEnd) {
        const endDate = new Date(filters.dateEnd);
        endDate.setHours(23, 59, 59, 999);
        mongoFilter.visitedAt.$lte = endDate;
      }
    }

    const [data, total] = await Promise.all([
      collection
        .find(mongoFilter)
        .collation({ locale: "pt", strength: 1 })
        .sort({ _id: -1, visitedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(mongoFilter),
    ]);
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getAllForExport(churchId: string, filters?: {
    name?: string;
    dateStart?: string;
    dateEnd?: string;
  }) {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const mongoFilter: any = { churchId };

    if (filters?.name) {
      mongoFilter.name = { $regex: filters.name, $options: "i" };
    }

    if (filters?.dateStart || filters?.dateEnd) {
      mongoFilter.visitedAt = {};
      if (filters.dateStart) {
        mongoFilter.visitedAt.$gte = new Date(filters.dateStart);
      }
      if (filters.dateEnd) {
        const endDate = new Date(filters.dateEnd);
        endDate.setHours(23, 59, 59, 999);
        mongoFilter.visitedAt.$lte = endDate;
      }
    }

    const data = await collection
      .find(mongoFilter)
      .collation({ locale: "pt", strength: 1 })
      .sort({ visitedAt: -1, _id: -1 })
      .toArray();

    return data;
  }

  async getVisitantesByCem(churchId: string, cemId: string) {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const data = await collection
      .find({ churchId })
      .collation({ locale: "pt", strength: 1 })
      .sort({ data: -1 })
      .toArray();

    return data;
  }

  async create(data: Omit<VisitantesModel, "_id" | "createdAt">, churchId: string) {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.insertOne({
        ...data,
        churchId,
        createdAt: new Date(),
      });

      return result;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async import(data: VisitantesModel[]) {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      //@ts-ignore
      const result = await collection.insertMany(data);
      return {
        insertedCount: result.insertedCount,
      };
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async countVisitors(churchId: string): Promise<TVisitorCountResponse> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const monthly = await collection
        .aggregate<TMonthlyVisitor>([
          { $match: { churchId } },
          {
            $group: {
              _id: {
                year: { $year: "$visitedAt" },
                month: { $month: "$visitedAt" },
              },
              totalItems: { $sum: 1 },
            },
          },
          {
            $addFields: {
              monthYear: {
                $concat: [
                  { $toString: "$_id.year" },
                  "-",
                  {
                    $cond: {
                      if: { $lt: ["$_id.month", 10] },
                      then: { $concat: ["0", { $toString: "$_id.month" }] },
                      else: { $toString: "$_id.month" },
                    },
                  },
                ],
              },
            },
          },
          { $project: { _id: 0, monthYear: 1, totalItems: 1 } },
          { $sort: { monthYear: 1 } },
        ])
        .toArray();

      const now = new Date();
      const localStart = startOfDay(now);
      const localEnd = endOfDay(now);

      // converte para UTC removendo o offset local
      const start = new Date(localStart.getTime() - localStart.getTimezoneOffset() * 60000);
      const end = new Date(localEnd.getTime() - localEnd.getTimezoneOffset() * 60000);

      const count = await collection.countDocuments({
        churchId,
        visitedAt: {
          $gte: start,
          $lte: end,
        },
      });

      // 📈 Agrupa por origem (howHeard)
      const bySource = await collection
        .aggregate<TVisitorBySource>([
          { $match: { churchId } },
          {
            $group: {
              _id: {
                $cond: [{ $ifNull: ["$howHeard", false] }, { $toLower: "$howHeard" }, "outros"],
              },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              source: "$_id",
              count: 1,
            },
          },
        ])
        .toArray();

      // 🔄 Normaliza nomes das fontes conforme o tipo
      const normalizedBySource: TVisitorBySource[] = [
        "invited",
        "instagram",
        "facebook",
        "youtube",
        "outros",
      ].map((src) => ({
        source: src as TVisitorSource,
        count: bySource.find((s) => s.source === src)?.count || 0,
      }));
      return {
        monthly,
        visitorsToday: count,
        bySource: normalizedBySource,
      };
    } catch (err) {
      console.error("❌ Erro em countVisitors:", err);
      throw err;
    }
  }
}
