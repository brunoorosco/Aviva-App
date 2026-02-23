import { ObjectId, Document } from "mongodb";
import { ChurchModel } from "@/domain/models/churchs";
import { MongoHelper } from "../../mongoHelper";
import { TMinisterioUser } from "@/domain/models/users";

export class MinisterioMongoRepository {
  protected collectionName: string;

  constructor() {
    this.collectionName = "churchs";
  }

  async getMinisterios(churchId: string): Promise<any[]> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const collectionUsers = await MongoHelper.getCollection("users");
      const church = await collection.findOne<ChurchModel>(
        { _id: new ObjectId(churchId) },
        {
          projection: {
            ministerios: { $sortArray: { input: "$ministerios", sortBy: { name: 1 } } },
            _id: 0,
          },
        },
      );
      if (!church?.ministerios) return [];

      // para cada cell, pega contagem de membros ativos/inativos
      const cellsWithMembers = await Promise.all(
        church.ministerios.map(async (cell) => {
          const filterBase = {
            "cem._id": cell._id.toString(),
            role: { $ne: "bispo" }, // exclui bispo
          };

          const totalAtivos = await collectionUsers.countDocuments({
            ...filterBase,
            active: true,
          });

          return {
            ...cell,
            membersActive: totalAtivos,
          };
        }),
      );

      if (!church) {
        throw new Error(`Church with ID ${churchId} not found`);
      }
      return cellsWithMembers || [];
    } catch (error) {
      console.error("Error getting cells:", error);
      throw error;
    }
  }

  async getMinisterioById(churchId: string, ministerioId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const church = await collection.findOne<ChurchModel>(
        {
          _id: new ObjectId(churchId),
          ministerios: { $elemMatch: { _id: new ObjectId(ministerioId) } },
        },
        { projection: { "ministerios.$": 1, _id: 0 } },
      );
      if (!church || !church.ministerios || church.ministerios.length === 0) {
        return null;
      }
      return church.ministerios[0];
    } catch (error) {
      console.error("Error getting ministerio by id:", error);
      throw error;
    }
  }
  async getMinisterioByName(churchId: string, cemName: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const church = await collection.findOne<ChurchModel>(
        {
          _id: new ObjectId(churchId),
          "cells.name": RegExp(cemName, "i"),
        },
        { projection: { "cells.$": 1, _id: 0 } },
      );
      if (!church) {
        throw new Error(`Church with Name:: ${churchId} not found`);
      }
      return church.cells || [];
    } catch (error) {
      console.error("Error getting cells:", error);
      throw error;
    }
  }

  async create(churchId: string, data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const newId = new ObjectId(); // gera o _id antes

      await collection.updateOne(
        { _id: new ObjectId(churchId) },
        { $push: { ministerios: { _id: newId, ...data } } },
      );

      return { _id: newId.toHexString() };
    } catch (error) {
      console.error("Error creating cell:", error);
      throw error;
    }
  }

  async update(churchId: string, ministerioid: string, data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.updateOne(
        {
          _id: new ObjectId(churchId),
          "ministerios._id": new ObjectId(ministerioid),
        },
        {
          $set: Object.fromEntries(
            Object.entries(data).map(([key, value]) => [`ministerios.$.${key}`, value]),
          ),
        },
      );
      return result;
    } catch (error) {
      console.error("Error updating cell:", error);
      throw error;
    }
  }

  async delete(churchId: string, ministerioId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.updateOne(
        { _id: new ObjectId(churchId) },
        { $pull: { ministerios: { _id: new ObjectId(ministerioId) } } as any },
      );
      return result;
    } catch (error) {
      console.error("Error deleting ministerio:", error);
      throw error;
    }
  }

  async addMembro(
    churchId: string, 
    ministerioId: string, 
    userId: string, 
    userName: string, 
    tipo: 'membro' | 'lider'
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const field = tipo === 'lider' ? 'ministerios.$.lideres' : 'ministerios.$.membros';
      
      const result = await collection.updateOne(
        { 
          _id: new ObjectId(churchId),
          'ministerios._id': new ObjectId(ministerioId)
        },
        { 
          $addToSet: { 
            [field]: { 
              _id: userId, 
              name: userName 
            } 
          } 
        }
      );
      return result;
    } catch (error) {
      console.error("Error adding membro:", error);
      throw error;
    }
  }

  async removeMembro(
    churchId: string, 
    ministerioId: string, 
    userId: string, 
    tipo: 'membro' | 'lider'
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const field = tipo === 'lider' ? 'ministerios.$.lideres' : 'ministerios.$.membros';
      
      const result = await collection.updateOne(
        { 
          _id: new ObjectId(churchId),
          'ministerios._id': new ObjectId(ministerioId)
        },
        { 
          $pull: { 
            [field]: { 
              _id: userId
            } 
          } as any
        }
      );
      return result;
    } catch (error) {
      console.error("Error removing membro:", error);
      throw error;
    }
  }

  async updateUserMinisterios(
    userId: string,
    ministerio: TMinisterioUser,
    action: "add" | "remove",
  ): Promise<boolean> {
    const collectionUsers = await MongoHelper.getCollection("users");

    // Garante que ministerios seja um array
    await collectionUsers.updateOne(
      { _id: new ObjectId(userId), ministerios: { $not: { $type: "array" } } },
      { $set: { ministerios: [] } },
    );

    if (action === "add") {
      const user = await collectionUsers.findOne({
        _id: new ObjectId(userId),
        "ministerios._id": ministerio._id,
      });

      if (user) {
        throw new Error("Usuário já possui esse ministério.");
      }

      const result = await collectionUsers.updateOne(
        { _id: new ObjectId(userId) },
        {
          $push: { ministerios: ministerio } as any,
          $set: { updatedAt: new Date().toISOString() },
        },
      );

      return result.modifiedCount > 0;
    }

    const result = await collectionUsers.updateOne(
      { _id: new ObjectId(userId) },
      {
        $pull: { ministerios: { _id: ministerio._id } } as any,
        $set: { updatedAt: new Date().toISOString() },
      },
    );

    return result.modifiedCount > 0;
  }
}
