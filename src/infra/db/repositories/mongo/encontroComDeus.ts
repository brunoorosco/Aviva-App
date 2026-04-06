import { TEquipe, TPeople } from "@/domain/models/encontroComDeus";
import { MongoHelper } from "../../mongoHelper";
import { ObjectId } from "mongodb";

class EncontroComDeusRepository {
  private collectionName = "encontros";

  async create(encontro: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.insertOne(encontro);
      return result;
    } catch (error) {
      console.error("Error creating encontroComDeus:", error);
      throw error;
    }
  }

  async update(id: string, encontro: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...encontro, updatedAt: new Date() } },
      );
      return result;
    } catch (error) {
      console.error("Error updating encontroComDeus:", error);
      throw error;
    }
  }

  // Criar ou atualizar inscrição financeira de uma rede
  async upsertInscricaoRede(encontroId: string, redeId: string, inscricaoData: any): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName);

    // Busca o documento atual para verificar se a rede já existe
    const doc = await collection.findOne({ _id: new ObjectId(encontroId) });
    if (!doc) throw new Error("Encontro não encontrado");

    const financeiro = doc.financeiro || [];
    const redeExiste = financeiro.some((f: any) => f.rede._id === redeId);

    // Se zerou tudo, remove o registro financeiro
    if (
      inscricaoData.encontrista === 0 &&
      inscricaoData.equipe === 0 &&
      inscricaoData.pagamento.length === 0
    ) {
      return await collection.updateOne({ _id: new ObjectId(encontroId) }, [
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
      return await collection.updateOne({ _id: new ObjectId(encontroId) }, [
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
      { _id: new ObjectId(encontroId) },
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

  // Remove encontristas da rede e adiciona novos
  async replaceEncontristasPorRede(
    encontroId: string,
    redeId: string,
    novosEncontristas: TPeople[],
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      // Adiciona a rede em cada encontrista
      const encontristasComRede = novosEncontristas.map((e) => ({
        ...e,
        _id: new ObjectId().toString(),
      }));

      // Remove todos da rede e adiciona os novos em uma operação
      const result = await collection.updateOne({ _id: new ObjectId(encontroId) }, [
        {
          $set: {
            encontristas: {
              $concatArrays: [
                // Mantém encontristas de outras redes
                {
                  $filter: {
                    input: { $ifNull: ["$encontristas", []] }, // ← proteção se não existir
                    as: "encontrista",
                    cond: { $ne: ["$$encontrista.rede._id", redeId] },
                  },
                },
                // ↓ Array literal direto — não pode usar variável JS aqui
                encontristasComRede,
              ],
            },
          },
        },
      ]);

      return result;
    } catch (error) {
      console.error("Error replacing encontristas:", error);
      throw error;
    }
  }

  // Remove equipe da rede e adiciona nova
  async replaceEquipePorRede(
    encontroId: string,
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

      const result = await collection.updateOne({ _id: new ObjectId(encontroId) }, [
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

  // Atualizar quantidades de encontristas e equipe
  async updateQuantidades(
    encontroId: string,
    redeId: string,
    encontrista: number,
    equipe: number,
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const result = await collection.updateOne(
        {
          _id: new ObjectId(encontroId),
          "financeiro.rede._id": redeId,
        },
        {
          $set: {
            "financeiro.$.encontrista": encontrista,
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
  async addPagamento(encontroId: string, redeId: string, pagamento: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const result = await collection.updateOne(
        {
          _id: new ObjectId(encontroId),
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
  async removePagamento(encontroId: string, redeId: string, pagamentoId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const result = await collection.updateOne(
        {
          _id: new ObjectId(encontroId),
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
  async getInscricaoByRede(encontroId: string, redeId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const encontro = await collection.findOne(
        { _id: new ObjectId(encontroId) },
        { projection: { financeiro: 1 } },
      );
      console.log("[encontroComDeus.ts:308]", JSON.stringify(encontro, null, 2));
      const inscricao = encontro?.financeiro?.find((f: any) => f.rede._id === redeId);
      return inscricao || null;
    } catch (error) {
      console.error("Error getting inscricao by rede:", error);
      throw error;
    }
  }

  // Buscar todas as inscrições de um encontro
  async getAllInscricoes(encontroId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);

      const encontro = await collection.findOne(
        { _id: new ObjectId(encontroId) },
        { projection: { financeiro: 1 } },
      );

      return encontro?.financeiro || [];
    } catch (error) {
      console.error("Error getting all inscricoes:", error);
      throw error;
    }
  }

  async getEncontroComDeus(
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

  async getEncontroComDeusById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const encontro = await collection.findOne({ _id: new ObjectId(id) });
      return encontro;
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
            totalParticipantes: { $size: "$encontristas" },
          },
        },

        // Abrir os encontristas para agregações
        {
          $unwind: {
            path: "$encontristas",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Usar um único $facet para tudo
        {
          $facet: {
            // Resumo POR ENCONTRO
            resumoEncontros: [
              {
                $group: {
                  _id: "$_id",
                  numero: { $first: "$numeroCorrigido" },
                  data: { $first: "$data" },
                  totalParticipantes: { $first: "$totalParticipantes" },
                  encontristas: { $push: "$encontristas" },
                },
              },
              { $sort: { data: 1 } },
            ],

            // Totais por rede
            porRede: [
              {
                $group: {
                  _id: { $ifNull: ["$encontristas.rede", "Sem Rede"] },
                  total: { $sum: 1 },
                },
              },
              { $sort: { total: -1 } },
            ],

            // Totais por igreja
            porIgrejaOrigem: [
              {
                $group: {
                  _id: { $ifNull: ["$encontristas.igreja", "Não Informado"] },
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
            encontros: "$resumoEncontros",
            totaisPorRede: "$porRede",
            totaisPorIgreja: "$porIgrejaOrigem",
            totalAnual: {
              $sum: "$resumoEncontros.totalParticipantes",
            },
          },
        },
      ])
      .toArray();

    return resp;
  }
}

export { EncontroComDeusRepository };
