import { MongoHelper } from "../../mongoHelper";

export interface IRolePermission {
  role: string;
  modules: {
    name: string;
    read: boolean;
    write: boolean;
    edit: boolean;
    delete: boolean;
  }[];
  updatedAt?: Date;
}

export class PermissionsMongoRepository {
  private collectionName = "role_permissions";

  async getAll(): Promise<IRolePermission[]> {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return await collection.find({}).toArray() as unknown as IRolePermission[];
  }

  async getByRole(role: string): Promise<IRolePermission | null> {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return await collection.findOne({ role }) as unknown as IRolePermission;
  }

  async updateByRole(role: string, data: Partial<IRolePermission>): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return await collection.updateOne(
      { role },
      { $set: { ...data, updatedAt: new Date() } },
      { upsert: true }
    );
  }
}
