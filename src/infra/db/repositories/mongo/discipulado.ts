import { ObjectId } from "mongodb";
import { MongoHelper } from "../../mongoHelper";
import { AulaDiscipulado, CicloDiscipulado, Membro } from "@/domain/models/discupulado";

export class DiscipuladoMongoRepository {
  private ciclosCollection: string;
  private aulasCollection: string;
  private temasCollection: string;

  constructor() {
    this.ciclosCollection = "discipulado_ciclos";
    this.aulasCollection = "discipulado_aulas";
    this.temasCollection = "discipulado_temas";
  }

  // ==================== CICLOS ====================
  async getAllCiclos(): Promise<CicloDiscipulado[]> {
    try {
      const collection = await MongoHelper.getCollection(this.ciclosCollection);
      const ciclos = await collection.find({}).toArray();

      return ciclos.map((c) => ({
        id: c._id.toHexString(),
        nome: c.nome,
        dataInicio: c.dataInicio,
        dataFim: c.dataFim,
        ativo: c.ativo || false,
        inscritos: c.inscritos || [],
      }));
    } catch (error) {
      console.error("Error getting ciclos:", error);
      throw error;
    }
  }

  async getCicloAtivo(): Promise<CicloDiscipulado | null> {
    try {
      const collection = await MongoHelper.getCollection(this.ciclosCollection);
      const ciclo = await collection.findOne({ ativo: true });

      if (!ciclo) return null;

      return {
        id: ciclo._id.toHexString(),
        nome: ciclo.nome,
        dataInicio: ciclo.dataInicio,
        dataFim: ciclo.dataFim,
        ativo: true,
        inscritos: ciclo.inscritos || [],
      };
    } catch (error) {
      console.error("Error getting active ciclo:", error);
      throw error;
    }
  }

  async createCiclo(ciclo: Omit<CicloDiscipulado, "id">): Promise<CicloDiscipulado> {
    try {
      const collection = await MongoHelper.getCollection(this.ciclosCollection);
      const result = await collection.insertOne({
        ...ciclo,
        createdAt: new Date().toISOString(),
      });

      return {
        ...ciclo,
        id: result.insertedId.toHexString(),
      };
    } catch (error) {
      console.error("Error creating ciclo:", error);
      throw error;
    }
  }

  async addInscrito(cicloId: string, inscrito: Membro): Promise<boolean> {
    try {
      const collection = await MongoHelper.getCollection(this.ciclosCollection);
      
      // Ensure we don't add duplicates
      const result = await collection.updateOne(
        { _id: new ObjectId(cicloId), "inscritos.id": { $ne: inscrito.id } },
        {
          $push: { inscritos: inscrito } as any
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error adding inscrito to ciclo:", error);
      throw error;
    }
  }

  async removeInscrito(cicloId: string, membroId: string): Promise<boolean> {
    try {
      const collection = await MongoHelper.getCollection(this.ciclosCollection);
      const result = await collection.updateOne(
        { _id: new ObjectId(cicloId) },
        {
          $pull: { inscritos: { id: membroId } } as any
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error removing inscrito from ciclo:", error);
      throw error;
    }
  }

  async updateInscritoEnvio(cicloId: string, membroId: string, data: string, qrCodeUrl?: string): Promise<boolean> {
    try {
      const collection = await MongoHelper.getCollection(this.ciclosCollection);
      const updateData: any = { "inscritos.$.dataEnvioQRCode": data };
      if (qrCodeUrl) {
        updateData["inscritos.$.qrCodeUrl"] = qrCodeUrl;
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(cicloId), "inscritos.id": membroId },
        {
          $set: updateData
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error updating inscrito envio date:", error);
      throw error;
    }
  }

  // ==================== AULAS ====================
  async getAulasByCicloId(cicloId?: string): Promise<AulaDiscipulado[]> {
    try {
      const collection = await MongoHelper.getCollection(this.aulasCollection);
      const aulas = await collection.find().toArray();

      return aulas.map((a) => ({
        id: a._id.toHexString(),
        data: a.data,
        tema: a.tema,
        ministrador: a.ministrador,
        // cicloId: a.cicloId,
        alunos: a.alunos || [],
        createdAt: a.createdAt,
      }));
    } catch (error) {
      console.error("Error getting aulas by ciclo:", error);
      throw error;
    }
  }

  async getAulaById(id: string): Promise<AulaDiscipulado | null> {
    try {
      const collection = await MongoHelper.getCollection(this.aulasCollection);
      const aula = await collection.findOne({ _id: new ObjectId(id) });

      if (!aula) return null;
      return {
        id: aula._id.toHexString(),
        data: aula.data,
        tema: aula.tema,
        ministrador: aula.ministrador,
        cicloId: aula.cicloId,
        alunos: aula.alunos || [],
        createdAt: aula.createdAt,
      };

    } catch (error) {
      console.error("Error getting aula by id:", error);
      throw error;
    }
  }

  async createAula(aula: Omit<AulaDiscipulado, "id" | "createdAt">): Promise<AulaDiscipulado> {
    try {
      const collection = await MongoHelper.getCollection(this.aulasCollection);
      const result = await collection.insertOne({
        ...aula,
        createdAt: new Date().toISOString(),
      });

      return {
        ...aula,
        id: result.insertedId.toHexString(),
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating aula:", error);
      throw error;
    }
  }

  async updateAula(id: string, aula: Partial<AulaDiscipulado>): Promise<AulaDiscipulado | null> {
    try {
      const collection = await MongoHelper.getCollection(this.aulasCollection);
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...aula,
            updatedAt: new Date().toISOString(),
          },
        },
        { returnDocument: "after" },
      );

      if (!result) return null;

      return {
        id: result._id.toHexString(),
        data: result.data,
        tema: result.tema,
        ministrador: result.ministrador,
        cicloId: result.cicloId,
        alunos: result.alunos || [],
        createdAt: result.createdAt,
      };
    } catch (error) {
      console.error("Error updating aula:", error);
      throw error;
    }
  }

  async deleteAula(id: string): Promise<boolean> {
    try {
      const collection = await MongoHelper.getCollection(this.aulasCollection);
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error deleting aula:", error);
      throw error;
    }
  }

  // ==================== MEMBROS ====================
  async getAllMembros(): Promise<Membro[]> {
    try {
      const collection = await MongoHelper.getCollection("users");
      const users = await collection
        .find(
          {
            active: true,
            role: { $regex: /^(membro|discípulo)$/i },
          },
          {
            projection: {
              _id: 1,
              name: 1,
              "cem.name": 1,
            },
          },
        )
        .toArray();

      return users.map((u) => ({
        id: u._id.toHexString(),
        nome: u.name,
        rede: { name: u.cem?.name || "-", _id: u.cem?._id || "" },
      }));
    } catch (error) {
      console.error("Error getting membros:", error);
      throw error;
    }
  }

  // ==================== PENDÊNCIAS ====================
  async getPendenciasByCicloId(cicloId: string): Promise<
    {
      membroId: string;
      nome: string;
      rede: { name: string; _id: string };
      aulasPendentes: string[];
    }[]
  > {
    try {
      const aulasCollection = await MongoHelper.getCollection(this.aulasCollection);
      const usuariosCollection = await MongoHelper.getCollection("users");

      // Busca todas as aulas do ciclo
      const aulas = await aulasCollection.find({ cicloId }).toArray();

      // Busca o Ciclo para saber quem são os inscritos
      const ciclosCollection = await MongoHelper.getCollection(this.ciclosCollection);
      const ciclo = await ciclosCollection.findOne({ _id: new ObjectId(cicloId) });

      if (!ciclo || !ciclo.inscritos) return [];

      const inscritos = ciclo.inscritos;
      const pendencias: any[] = [];

      for (const inscrito of inscritos) {
        const membroId = inscrito.id;
        const aulasPerdidas: string[] = [];

        for (const aula of aulas) {
          const alunoPresente = aula.alunos?.find((a: any) => a.membroId === membroId);

          // Se não está na lista ou não esteve presente
          if (!alunoPresente || !alunoPresente.presente) {
            aulasPerdidas.push(aula.tema);
          }
        }

        // Se tem aulas pendentes, adiciona à lista de pendências
        if (aulasPerdidas.length > 0) {
          pendencias.push({
            membroId,
            nome: inscrito.nome,
            rede: inscrito.rede,
            aulasPendentes: aulasPerdidas,
          });
        }
      }

      return pendencias;
    } catch (error) {
      console.error("Error getting pendencias:", error);
      throw error;
    }
  }
}
