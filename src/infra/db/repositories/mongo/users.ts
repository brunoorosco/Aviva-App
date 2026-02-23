import { TMinisterialLevel } from "@/domain/models/ministerial";
import { ObjectId } from "mongodb";
import { MongoHelper } from "../../mongoHelper";
import { User } from "@/domain/models/users";
export class UsersMongoRepository {
  private collectionName: string;
  constructor() {
    this.collectionName = "users";
  }

  async getByEmail(email: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const user = await collection.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });

      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async geUserById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      //@ts-ignore
      const user = await collection.findOne({ _id: new ObjectId(id) });

      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async create(user: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = collection.insertOne(user);
      return result; // Retorna o usuário inserido
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUsersByCellId(
    cemId: string,
    name?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    totalPages: number;
    totalAtivos: number;
    totalInativos: number;
  }> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const skip = (page - 1) * limit;

      // 🔹 filtro dinâmico
      const filter: any = {
        cem: { $ne: null },
        "cem._id": cemId,
        role: { $ne: "bispo" }, // sempre exclui bispo
      };

      if (name && name.trim().length > 0) {
        filter.name = { $regex: name, $options: "i" }; // case-insensitive
      }

      const [data, total, totalInativos, totalAtivos] = await Promise.all([
        collection
          .find(filter)
          .collation({ locale: "pt", strength: 1 })
          .sort({ active: -1, name: 1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        collection.countDocuments(filter),
        collection.countDocuments({ active: false, ...filter }),
        collection.countDocuments({ active: true, ...filter }),
      ]);

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        totalAtivos,
        totalInativos,
      };
    } catch (error) {
      console.error("Error get users by cell:", error);
      throw error;
    }
  }

  async getUsersByCellIdEquipe(cemId: string): Promise<{ _id: string; name: string }[]> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const filter = {
        "cem._id": cemId,
        active: true,
        role: { $ne: "bispo" },
      };

      const users = await collection
        .find<{ _id: any; name: string }>(filter)
        .project({ _id: 1, name: 1 })
        .collation({ locale: "pt", strength: 1 })
        .sort({ active: -1, name: 1 })
        .toArray();

      return users.map((user) => ({
        _id: user._id.toString(),
        name: user.name,
      }));
    } catch (error) {
      console.error("Error get users by cell:", error);
      throw error;
    }
  }

  async getUsersByChurch(churchId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = collection.find({}).toArray();
      return result;
    } catch (error) {
      console.error("Error get users:", error);
      throw error;
    }
  }
  async changeStatusUser(userId: string, data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { active: data ? true : false, updatedAt: new Date() } },
      );
      return result;
    } catch (error) {
      console.error("Error get users:", error);
      throw error;
    }
  }

  async updateUser(userId: string, data: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            ...data, // Espalha as propriedades para atualizar campos individualmente
            updatedAt: new Date(),
          },
        },
      );
      return result;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
  
  async getUserByName(churchId: string, name: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection

        .find(
          { name: new RegExp(name, "i"), churchId: churchId, active: true },
          {
            projection: {
              name: 1,
              _id: 1,
            },
          },
        )
        .collation({ locale: "pt", strength: 1 })
        .toArray();
      return result;
    } catch (error) {
      console.error("Error get user:", error);
      throw error;
    }
  }

  async getUsersByChurchId(
    churchId: string,
    page: number = 1,
    limit: number = 10,
    name?: string, // 🔹 parâmetro opcional
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const skip = (page - 1) * limit;

      // 🔹 filtro dinâmico
      const filter: any = { churchId };
      if (name && name.trim().length > 0) {
        filter.name = { $regex: name, $options: "i" }; // case-insensitive
      }

      const [data, total] = await Promise.all([
        collection
          .find(filter)
          .collation({ locale: "pt", strength: 1 })
          .sort({ active: -1, name: 1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        collection.countDocuments(filter),
      ]);

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error get users with pagination:", error);
      throw error;
    }
  }

  async updateByEmail({
    email,
    password,
    permission,
  }: {
    email: string;
    password: string;
    permission: string[];
  }) {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const resp = await collection.updateOne(
      { email },
      {
        $set: {
          password,
          permission: permission,
          updatedAt: new Date(),
        },
      },
    );
    return resp;
  }

  async getUsersByStatus(churchId: string, cargo: TMinisterialLevel) {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const roleFilter =
      cargo.toLowerCase() === "membro"
        ? { $regex: /^(membro|discípulo)$/i }
        : { $regex: `^${cargo}$`, $options: "i" };

    const resp = await collection
      .find(
        {
          churchId,
          active: true,
          role: roleFilter,
          "cem.name": { $exists: true, $ne: null },
        },
        {
          projection: { _id: 1, name: 1, role: 1, email: 1, "cem.name": 1 },
        },
      )
      .collation({ locale: "pt", strength: 1 })
      .sort({ name: 1 })
      .toArray();

    return resp;
  }

  async updateSettings(userId: string, data: Partial<User>): Promise<User> {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      throw new Error("Erro ao atualizar usuário");
    }

    //@ts-ignore
    return result as User;
  }

  async addConsagracao({
    id,
    ministerialLevel,
    data,
  }: {
    id: string;
    ministerialLevel: string;
    data: string;
  }) {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          consagracao: {
            ministerialLevel,
            data,
          },
        } as any, // ou use UpdateFilter<UserDocument>
        $set: {
          role: ministerialLevel,
          updatedAt: new Date(),
        } as any,
      },
    );

    if (!result) {
      throw new Error("Erro ao atualizar usuário");
    }

    //@ts-ignore
    return result as User;
  }
}
