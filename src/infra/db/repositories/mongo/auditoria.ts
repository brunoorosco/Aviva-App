import { AuditoriaModel } from "@/domain/models/auditoria";
import { MongoHelper } from "../../mongoHelper";

export class AuditoriaRepository {
  private collectionName = "auditoria";
  private static indexCreated = false;

  async create(auditData: AuditoriaModel): Promise<void> {

    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      // Garante que o índice TTL seja criado apenas uma vez por execução do servidor
      if (!AuditoriaRepository.indexCreated) {
        await collection.createIndex(
          { createdAt: 1 },
          { expireAfterSeconds: 60 * 60 * 24 * 10 } // 10 dias
        );
        AuditoriaRepository.indexCreated = true;
      }

      await collection.insertOne(auditData);
    } catch (error) {
      console.error("Error creating audit log:", error);
    }
  }
}

