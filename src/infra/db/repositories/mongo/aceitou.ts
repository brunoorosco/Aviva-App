import { TEvent } from "@/domain/models/events";
import { ObjectId } from "mongodb";
import { MongoHelper } from "../../mongoHelper";

export class AceitouRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = "aceitou";
  }

  async getUseusAceitou(churchId: string) {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const data = await collection
      .find({ churchId })
      .collation({ locale: "pt", strength: 1 })
      .sort({ data: -1 })
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

  async create(data: Omit<TEvent, "_id">): Promise<TEvent> {
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
