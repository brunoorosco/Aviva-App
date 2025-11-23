import { AceitouModel } from "@/domain/models/aceitou";
import { TEvent } from "@/domain/models/events";
import { MongoHelper } from "../../mongoHelper";

export class AceitouRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = "aceitou";
  }

  async getUseusAceitou(churchId: string, page: number = 1, limit: number = 10) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      collection
        .find({ churchId })
        .collation({ locale: "pt", strength: 1 })
        .sort({ _id: -1, visitedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
       collection.countDocuments({ churchId }),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
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
}
