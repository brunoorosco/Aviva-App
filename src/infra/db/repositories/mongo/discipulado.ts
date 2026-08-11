import { ObjectId } from "mongodb";
import { MongoHelper } from "../../mongoHelper";
import {
  AulaDiscipulado,
  AulaRelatorio,
  AlunoRelatorio,
  CicloDiscipulado,
  Membro,
  RedeRelatorio,
  RelatorioCiclo,
} from "@/domain/models/discupulado";

const FALTAS_LIMITE = 3;

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

  async getCicloById(cicloId: string): Promise<CicloDiscipulado | null> {
    try {
      const collection = await MongoHelper.getCollection(this.ciclosCollection);
      const ciclo = await collection.findOne({ _id: new ObjectId(cicloId) });

      if (!ciclo) return null;

      return {
        id: ciclo._id.toHexString(),
        nome: ciclo.nome,
        dataInicio: ciclo.dataInicio,
        dataFim: ciclo.dataFim,
        ativo: ciclo.ativo || false,
        inscritos: ciclo.inscritos || [],
      };
    } catch (error) {
      console.error("Error getting ciclo by id:", error);
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
      const query = cicloId ? { cicloId } : {};
      const aulas = await collection.find(query).toArray();

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

  async updatePresencaAluno(aulaId: string, membroId: string, presente: boolean, studentData?: any): Promise<boolean> {
    try {
      const collection = await MongoHelper.getCollection(this.aulasCollection);
      
      // 1. Tentar atualizar aluno existente
      const updateResult = await collection.updateOne(
        { _id: new ObjectId(aulaId), "alunos.membroId": membroId },
        { 
          $set: { "alunos.$.presente": presente, updatedAt: new Date().toISOString() } 
        }
      );

      // 2. Se não encontrou o aluno na lista, adiciona (Reposição)
      if (updateResult.matchedCount === 0 && presente) {
        const novoAluno = {
          membroId,
          nome: studentData?.nome || "Aluno Identificado Pelo QR",
          rede: studentData?.rede || { name: "Reposição/Visitante", _id: "" },
          presente: true
        };

        await collection.updateOne(
          { _id: new ObjectId(aulaId) },
          { 
            $push: { alunos: novoAluno } as any,
            $set: { updatedAt: new Date().toISOString() }
          }
        );
      }

      return true;
    } catch (error) {
      console.error("Error updating student presence:", error);
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

  // ==================== RELATÓRIO POR CICLO ====================
  async getRelatorioCiclo(cicloId: string): Promise<RelatorioCiclo | null> {
    try {
      const ciclo = await this.getCicloById(cicloId);
      if (!ciclo) return null;

      const aulasCollection = await MongoHelper.getCollection(this.aulasCollection);
      const aulas = await aulasCollection.find({ cicloId }).toArray();
      const inscritos = ciclo.inscritos || [];

      const totalAulas = aulas.length;
      const totalMatriculados = inscritos.length;

      // Relatório por aluno
      const alunos: AlunoRelatorio[] = inscritos.map((inscrito) => {
        let faltas = 0;

        for (const aula of aulas) {
          const alunoPresente = aula.alunos?.find(
            (a: any) => a.membroId === inscrito.id,
          );
          if (!alunoPresente || !alunoPresente.presente) {
            faltas += 1;
          }
        }

        const presencas = Math.max(totalAulas - faltas, 0);
        const frequencia = totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 0;
        const status = faltas <= FALTAS_LIMITE ? "aprovado" : "reprovado";

        return {
          membroId: inscrito.id,
          nome: inscrito.nome,
          rede: inscrito.rede,
          totalAulas,
          presencas,
          faltas,
          frequencia,
          status,
        };
      });

      const aprovados = alunos.filter((a) => a.status === "aprovado").length;
      const reprovados = alunos.filter((a) => a.status === "reprovado").length;
      const percentualAprovacao =
        totalMatriculados > 0 ? Math.round((aprovados / totalMatriculados) * 100) : 0;
      const presencaMedia =
        totalMatriculados > 0
          ? Math.round(
              alunos.reduce((acc, aluno) => acc + aluno.frequencia, 0) /
                totalMatriculados,
            )
          : 0;

      // Relatório por aula
      const aulasRelatorio: AulaRelatorio[] = aulas.map((aula) => {
        const presentes = (aula.alunos || []).filter((a: any) => a.presente).length;
        const ausentes = Math.max(totalMatriculados - presentes, 0);

        return {
          id: aula._id.toHexString(),
          data: aula.data,
          tema: aula.tema,
          ministrador: aula.ministrador,
          presentes,
          ausentes,
        };
      });

      // Breakdown por rede
      const porRede: RedeRelatorio[] = [];
      const redeMap = new Map<string, RedeRelatorio>();
      for (const aluno of alunos) {
        const nomeRede = aluno.rede?.name || "Sem Rede";
        const atual = redeMap.get(nomeRede) || {
          rede: nomeRede,
          total: 0,
          aprovados: 0,
          reprovados: 0,
        };
        atual.total += 1;
        if (aluno.status === "aprovado") atual.aprovados += 1;
        else atual.reprovados += 1;
        redeMap.set(nomeRede, atual);
      }
      for (const rede of redeMap.values()) {
        porRede.push(rede);
      }
      porRede.sort((a, b) => b.total - a.total);

      return {
        ciclo: {
          id: ciclo.id,
          nome: ciclo.nome,
          dataInicio: ciclo.dataInicio,
          dataFim: ciclo.dataFim,
          ativo: ciclo.ativo,
        },
        totalAulas,
        totalMatriculados,
        aprovados,
        reprovados,
        percentualAprovacao,
        presencaMedia,
        aulas: aulasRelatorio,
        alunos,
        porRede,
      };
    } catch (error) {
      console.error("Error getting relatorio by ciclo:", error);
      throw error;
    }
  }
}
