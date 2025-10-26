import { TEvent } from "@/domain/models/events";
import { VisitantesModel } from "@/domain/models/visitantes";
import { MongoHelper } from "../../mongoHelper";

export class VisitantesRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = "visitantes";
  }

  async getVisitantes(churchId: string) {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const data = await collection
      .find({ churchId })
      .collation({ locale: "pt", strength: 1 })
      .sort({ data: -1 })
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
