import { TEvent } from "@/domain/models/events";
import { VisitantesModel } from "@/domain/models/visitantes";
import { MongoHelper } from "../../mongoHelper";

export class VisitantesRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = "visitantes";
  }

  async getVisitantes(churchId: string, page: number = 1, limit: number = 10) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      collection
        .find({ churchId })
        .collation({ locale: "pt", strength: 1 })
        .sort({ visitedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(),
    ]);
    return { data, total, page, totalPages: Math.ceil(total / limit) };
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

  async countVisitors(churchId: string) {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const resp = await collection
        .aggregate([
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
          {
            $project: { _id: 0, monthYear: 1, totalItems: 1 },
          },
          {
            $sort: { monthYear: 1 },
          },
        ])
        .toArray();

      console.log(JSON.stringify(resp));
      return resp;
    } catch (err) {
      console.error(err);
    }
  }
}
