import { TEquipe, TPeople } from "@/domain/models/encontroComDeus";
import { MongoHelper } from "../../mongoHelper";
import { ObjectId } from "mongodb";

class ReencontroComDeusRepository {
  private collectionName = "reencontros";

  async create(reencontro: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.insertOne(reencontro);
      return result;
    } catch (error) {
      console.error("Error creating reencontroComDeus:", error);
      throw error;
    }
  }

  async update(id: string, reencontro: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...reencontro, updatedAt: new Date() } },
      );
      return result;
    } catch (error) {
      console.error("Error updating reencontroComDeus:", error);
      throw error;
    }
  }

  // Criar ou atualizar inscrição financeira de uma rede
  async upsertInscricaoRede(reencontroId: string, redeId: string, inscricaoData: any): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName);

    // Busca o documento atual para verificar se a rede já existe
    const doc = await collection.findOne({ _id: new ObjectId(reencontroId) });
    if (!doc) throw new Error("Reencontro não encontrado");

    const financeiro = doc.financeiro || [];
    const redeExiste = financeiro.some((f: any) => f.rede._id === redeId);

    // Se zerou tudo, remove o registro financeiro
    if (
      inscricaoData.reencontrista === 0 &&
      inscricaoData.equipe === 0 &&
      inscricaoData.pagamento.length === 0
    ) {
      return await collection.updateOne({ _id: new ObjectId(reencontroId) }, [
        {
          $set: {
            financeiro: {
              $filter: {
                input: "$financeiro",
                as: "fin",
                cond: { $ne: ["$$fin.rede._id", redeId] },
              },
            },
          },
        },
      ]);
    }

    // Rede já existe → atualiza com $map
    if (redeExiste) {
      return await collection.updateOne({ _id: new ObjectId(reencontroId) }, [
        {
          $set: {
            financeiro: {
              $map: {
                input: "$financeiro",
                as: "fin",
                in: {
                  $cond: {
                    if: { $eq: ["$$fin.rede._id", redeId] },
                    then: {
                      $mergeObjects: [
                        "$$fin",
                        {
                          ...inscricaoData,
                          updatedAt: new Date().toISOString(),
                        },
                      ],
                    },
                    else: "$$fin",
                  },
                },
              },
            },
          },
        },
      ]);
    }

    // Rede não existe → adiciona com $push normal (sem conflito)
    return await collection.updateOne(
      { _id: new ObjectId(reencontroId) },
      {
        $push: {
          financeiro: {
            ...inscricaoData,
            _id: new ObjectId().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      },
    );
  }

  // Remove reencontristas da rede e adiciona novos
  async replaceReencontristasPorRede(
    reencontroId: string,
    redeId: string,
    novosReencontristas: TPeople[],
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      // Adiciona a rede em cada reencontrista e preserva o _id se existir
      const reencontristasComRede = novosReencontristas.map((e) => ({
        ...e,
        _id: e._id || new ObjectId().toString(),
      }));

      // Remove todos da rede e adiciona os novos em uma operação
      const result = await collection.updateOne({ _id: new ObjectId(reencontroId) }, [
        {
          $set: {
            reencontristas: {
              $concatArrays: [
                // Mantém reencontristas de outras redes
                {
                  $filter: {
                    input: { $ifNull: ["$reencontristas", []] },
                    as: "reencontrista",
                    cond: { $ne: ["$$reencontrista.rede._id", redeId] },
                  },
                },
                reencontristasComRede,
              ],
            },
            updatedAt: new Date(),
          },
        },
      ]);

      return result;
    } catch (error) {
      console.error("Error replacing reencontristas:", error);
      throw error;
    }
  }

  // Remove equipe da rede e adiciona nova
  async replaceEquipePorRede(
    reencontroId: string,
    redeId: string,
    novosMembers: TEquipe[],
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      // Garante que cada membro tem a rede correta
      const membersComRede = novosMembers.map((m) => ({
        ...m,
        rede: { _id: redeId, name: m.rede?.name || "" },
      }));

      const result = await collection.updateOne({ _id: new ObjectId(reencontroId) }, [
        {
          $set: {
            equipe: {
              $concatArrays: [
                // Mantém membros de outras redes
                {
                  $filter: {
                    input: { $ifNull: ["$equipe", []] }, // ← proteção se não existir
                    as: "membro", // ← FALTAVA ISSO
                    cond: { $ne: ["$$membro.rede._id", redeId] }, // ← usa $$membro
                  },
                },
                // Adiciona novos membros desta rede
                membersComRede,
              ],
            },
          },
        },
      ]);

      return result;
    } catch (error) {
      console.error("Error replacing equipe:", error);
      throw error;
    }
  }

  // Atualizar quantidades de reencontristas e equipe
  async updateQuantidades(
    reencontroId: string,
    redeId: string,
    reencontrista: number,
    equipe: number,
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const result = await collection.updateOne(
        {
          _id: new ObjectId(reencontroId),
          "financeiro.rede._id": redeId,
        },
        {
          $set: {
            "financeiro.$.reencontrista": reencontrista,
            "financeiro.$.equipe": equipe,
            "financeiro.$.updatedAt": new Date().toISOString(),
          },
        },
      );

      return result;
    } catch (error) {
      console.error("Error updating quantidades:", error);
      throw error;
    }
  }

  // Adicionar pagamento
  async addPagamento(reencontroId: string, redeId: string, pagamento: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const result = await collection.updateOne(
        {
          _id: new ObjectId(reencontroId),
          "financeiro.rede._id": redeId,
        },
        {
          $push: {
            "financeiro.$.pagamento": {
              ...pagamento,
              _id: new ObjectId().toString(),
              createdAt: new Date().toISOString(),
            },
          },
          $set: {
            "financeiro.$.updatedAt": new Date().toISOString(),
          },
        },
      );

      return result;
    } catch (error) {
      console.error("Error adding pagamento:", error);
      throw error;
    }
  }

  // Remover pagamento
  async removePagamento(reencontroId: string, redeId: string, pagamentoId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const result = await collection.updateOne(
        {
          _id: new ObjectId(reencontroId),
          "financeiro.rede._id": redeId,
        },
        [
          {
            $set: {
              financeiro: {
                $map: {
                  input: "$financeiro",
                  as: "fin",
                  in: {
                    $cond: {
                      if: { $eq: ["$$fin.rede._id", redeId] },
                      then: {
                        $mergeObjects: [
                          "$$fin",
                          {
                            updatedAt: new Date().toISOString(),
                            pagamento: {
                              $filter: {
                                input: "$$fin.pagamento",
                                as: "pag",
                                cond: { $ne: ["$$pag._id", pagamentoId] },
                              },
                            },
                          },
                        ],
                      },
                      else: "$$fin",
                    },
                  },
                },
              },
            },
          },
        ],
      );

      return result;
    } catch (error) {
      console.error("Error removing pagamento:", error);
      throw error;
    }
  }

  // Buscar inscrição específica de uma rede
  async getInscricaoByRede(reencontroId: string, redeId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const reencontro = await collection.findOne(
        { _id: new ObjectId(reencontroId) },
        { projection: { financeiro: 1 } },
      );
      console.log("[reencontroComDeus.ts:308]", JSON.stringify(reencontro, null, 2));
      const inscricao = reencontro?.financeiro?.find((f: any) => f.rede._id === redeId);
      return inscricao || null;
    } catch (error) {
      console.error("Error getting inscricao by rede:", error);
      throw error;
    }
  }

  // Buscar todas as inscrições de um reencontro
  async getAllInscricoes(reencontroId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const reencontro = await collection.findOne(
        { _id: new ObjectId(reencontroId) },
        { projection: { financeiro: 1 } },
      );

      return reencontro?.financeiro || [];
    } catch (error) {
      console.error("Error getting all inscricoes:", error);
      throw error;
    }
  }

  async getReencontroComDeus(
    churchId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      collection
        .find({})
        .collation({ locale: "pt", strength: 1 })
        .sort({ data: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments({ churchId }),
    ]);
    console.log("data :>> ", total);
    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getReencontroComDeusById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const reencontro = await collection.findOne({ _id: new ObjectId(id) });
      return reencontro;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async fechamentoAnual(ano: string) {
    const startOfYear = new Date(`${ano}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${ano}-12-31T23:59:59.999Z`);
    const collection = await MongoHelper.getCollection(this.collectionName);

    const resp = await collection
      .aggregate([
        // Filtrar pelo ano desejado
        {
          $match: {
            data: { $gte: startOfYear, $lte: endOfYear },
          },
        },

        // Criar campos básicos para o resumo
        {
          $addFields: {
            numeroCorrigido: { $ifNull: ["$numero", "$numro"] },
            totalParticipantes: { $size: "$reencontristas" },
          },
        },

        // Abrir os reencontristas para agregações
        {
          $unwind: {
            path: "$reencontristas",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Usar um único $facet para tudo
        {
          $facet: {
            // Resumo POR REENCONTRO
            resumoReencontros: [
              {
                $group: {
                  _id: "$_id",
                  numero: { $first: "$numeroCorrigido" },
                  data: { $first: "$data" },
                  totalParticipantes: { $first: "$totalParticipantes" },
                  reencontristas: { $push: "$reencontristas" },
                },
              },
              { $sort: { data: 1 } },
            ],

            // Totais por rede
            porRede: [
              {
                $group: {
                  _id: { $ifNull: ["$reencontristas.rede", "Sem Rede"] },
                  total: { $sum: 1 },
                },
              },
              { $sort: { total: -1 } },
            ],

            // Totais por igreja
            porIgrejaOrigem: [
              {
                $group: {
                  _id: { $ifNull: ["$reencontristas.igreja", "Não Informado"] },
                  total: { $sum: 1 },
                },
              },
              { $sort: { total: -1 } },
            ],
          },
        },

        // Saída final organizada
        {
          $project: {
            reencontros: "$resumoReencontros",
            totaisPorRede: "$porRede",
            totaisPorIgreja: "$porIgrejaOrigem",
            totalAnual: {
              $sum: "$resumoReencontros.totalParticipantes",
            },
          },
        },
      ])
      .toArray();

    return resp;
  }
}

export { ReencontroComDeusRepository };
