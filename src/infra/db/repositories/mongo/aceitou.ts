import { AceitouModel } from "@/domain/models/aceitou";
import { TEvent } from "@/domain/models/events";
import { MongoHelper } from "../../mongoHelper";
import { ObjectId } from "mongodb";

export class AceitouRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = "aceitou";
  }

  async getUseusAceitou(churchId: string, page: number = 1, limit: number = 10, filters?: {
    name?: string;
    rede?: string;
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

    if (filters?.rede) {
      mongoFilter["rede.name"] = { $regex: filters.rede, $options: "i" };
    }

    if (filters?.dateStart || filters?.dateEnd) {
      mongoFilter.acceptedAt = {};
      if (filters.dateStart) {
        mongoFilter.acceptedAt.$gte = new Date(filters.dateStart);
      }
      if (filters.dateEnd) {
        const endDate = new Date(filters.dateEnd);
        endDate.setHours(23, 59, 59, 999);
        mongoFilter.acceptedAt.$lte = endDate;
      }
    }

    const [data, total] = await Promise.all([
      collection
        .find(mongoFilter)
        .collation({ locale: "pt", strength: 1 })
        .sort({ acceptedAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(mongoFilter),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getAllForExport(churchId: string, filters?: {
    name?: string;
    rede?: string;
    dateStart?: string;
    dateEnd?: string;
  }) {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const mongoFilter: any = { churchId };

    if (filters?.name) {
      mongoFilter.name = { $regex: filters.name, $options: "i" };
    }

    if (filters?.rede) {
      mongoFilter["rede.name"] = { $regex: filters.rede, $options: "i" };
    }

    if (filters?.dateStart || filters?.dateEnd) {
      mongoFilter.acceptedAt = {};
      if (filters.dateStart) {
        mongoFilter.acceptedAt.$gte = new Date(filters.dateStart);
      }
      if (filters.dateEnd) {
        const endDate = new Date(filters.dateEnd);
        endDate.setHours(23, 59, 59, 999);
        mongoFilter.acceptedAt.$lte = endDate;
      }
    }

    const data = await collection
      .find(mongoFilter)
      .collation({ locale: "pt", strength: 1 })
      .sort({ acceptedAt: -1, _id: -1 })
      .toArray();

    return data;
  }

  async getUseusAceitouByCem(churchId: string, cemId: string) {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const data = await collection
      .find({ churchId })
      .collation({ locale: "pt", strength: 1 })
      .sort({ data: -1 })
      .toArray();

    return data;
  }

  async create(data: Omit<AceitouModel, "_id" | "createdAt">, churchId: string) {
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

  async import(data: Omit<TEvent, "_id">): Promise<TEvent> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.insertOne({
        ...data,
        createdAt: new Date(),
      });
      return {
        _id: result.insertedId.toString(),
        ...data,
      };
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }
  async getAnalytics(churchId: string, redeId?: string) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const match: any = { churchId: (churchId) };
    
    // Filtro opcional por Rede/Célula
    if (redeId && redeId !== "all") {
      match["rede._id"] = redeId;
    }

   return await collection.aggregate([
      { $match: match },
      {
        $facet: {
          // Totais baseados na lógica informada
          "stats": [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                // true -> aceitou jesus
                countAcceptedTrue: { $sum: { $cond: [{ $eq: ["$accepted", true] }, 1, 0] } },
                // false -> reconciliou
                countAcceptedFalse: { $sum: { $cond: [{ $eq: ["$accepted", false] }, 1, 0] } },
                countBaptized: { $sum: { $cond: [{ $eq: ["$baptism", true] }, 1, 0] } },
                countHasEncontro: { $sum: { $cond: [{ $eq: ["$hasEncontro", true] }, 1, 0] } },
                // Pendentes de batismo (todos os que não são batizados)
                countPendingBaptism: { $sum: { $cond: [{ $eq: ["$baptism", false] }, 1, 0] } }
              }
            }
          ],
          // Agrupamento temporal para os gráficos
          "timeline": [
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" }
                },
                accepted: { $sum: { $cond: [{ $eq: ["$accepted", true] }, 1, 0] } },
                reconciled: { $sum: { $cond: [{ $eq: ["$accepted", false] }, 1, 0] } }
              }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
          ]
        }
      }
    ]).toArray();
  }
}
