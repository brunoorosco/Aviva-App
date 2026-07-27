import { ObjectId } from "mongodb";
import { MongoHelper } from "../../mongoHelper";
import { TParticipante, TEquipeConferencia } from "@/domain/models/conferencia";

class ConferenciaRepository {
  private collectionName = "conferencias";

  async create(conferencia: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.insertOne(conferencia);
      return result;
    } catch (error) {
      console.error("Error creating conferencia:", error);
      throw error;
    }
  }

  async update(id: string, conferencia: any): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...conferencia, updatedAt: new Date() } }
      );
      return result;
    } catch (error) {
      console.error("Error updating conferencia:", error);
      throw error;
    }
  }

  async getConferencias(
    churchId: string,
    page: number = 1,
    limit: number = 10
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
        .find({ churchId })
        .collation({ locale: "pt", strength: 1 })
        .sort({ data: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments({ churchId }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getConferenciaById(id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const conferencia = await collection.findOne({ _id: new ObjectId(id) });
      return conferencia;
    } catch (error) {
      console.error("Error finding conferencia by id:", error);
      throw error;
    }
  }

  // Criar ou atualizar inscrição financeira de uma rede
  async upsertInscricaoRede(
    conferenciaId: string,
    redeId: string,
    inscricaoData: any
  ): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName);
    const doc = await collection.findOne({ _id: new ObjectId(conferenciaId) });
    if (!doc) throw new Error("Conferência não encontrada");

    const financeiro = doc.financeiro || [];
    const redeExiste = financeiro.some((f: any) => f.rede._id === redeId);

    // Se zerou tudo, remove o registro financeiro
    if (
      inscricaoData.participante === 0 &&
      inscricaoData.pagamento.length === 0
    ) {
      return await collection.updateOne({ _id: new ObjectId(conferenciaId) }, [
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

    if (redeExiste) {
      return await collection.updateOne({ _id: new ObjectId(conferenciaId) }, [
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

    return await collection.updateOne(
      { _id: new ObjectId(conferenciaId) },
      {
        $push: {
          financeiro: {
            ...inscricaoData,
            _id: new ObjectId().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
        },
      }
    );
  }

  // Substituir participantes de uma rede
  async replaceParticipantesPorRede(
    conferenciaId: string,
    redeId: string,
    novosParticipantes: TParticipante[]
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const participantesComRede = novosParticipantes.map((p) => ({
        ...p,
        _id: p._id || new ObjectId().toString(),
      }));

      const result = await collection.updateOne({ _id: new ObjectId(conferenciaId) }, [
        {
          $set: {
            participantes: {
              $concatArrays: [
                {
                  $filter: {
                    input: { $ifNull: ["$participantes", []] },
                    as: "participante",
                    cond: { $ne: ["$$participante.rede._id", redeId] },
                  },
                },
                participantesComRede,
              ],
            },
            updatedAt: new Date(),
          },
        },
      ]);
      return result;
    } catch (error) {
      console.error("Error replacing participantes:", error);
      throw error;
    }
  }

  // Substituir equipe de uma rede
  async replaceEquipePorRede(
    conferenciaId: string,
    redeId: string,
    novosMembers: TEquipeConferencia[]
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const membersComRede = novosMembers.map((m) => ({
        ...m,
        rede: { _id: redeId, name: m.rede?.name || "" },
      }));

      const result = await collection.updateOne({ _id: new ObjectId(conferenciaId) }, [
        {
          $set: {
            equipe: {
              $concatArrays: [
                {
                  $filter: {
                    input: { $ifNull: ["$equipe", []] },
                    as: "membro",
                    cond: { $ne: ["$$membro.rede._id", redeId] },
                  },
                },
                membersComRede,
              ],
            },
          },
        },
      ]);
      return result;
    } catch (error) {
      console.error("Error replacing equipe conferencia:", error);
      throw error;
    }
  }

  // Buscar inscrição específica de uma rede
  async getInscricaoByRede(conferenciaId: string, redeId: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const conferencia = await collection.findOne(
        { _id: new ObjectId(conferenciaId) },
        { projection: { financeiro: 1, participantes: 1, equipe: 1 } }
      );

      const inscricao = conferencia?.financeiro?.find((f: any) => f.rede._id === redeId);
      const participantesDaRede = (conferencia?.participantes || []).filter(
        (p: any) => p.rede?._id === redeId
      );
      const equipeDaRede = (conferencia?.equipe || []).filter(
        (m: any) => m.rede?._id === redeId
      );

      return {
        financeiro: inscricao || null,
        participantes: participantesDaRede,
        equipe: equipeDaRede,
        conferencia: { _id: conferenciaId },
      };
    } catch (error) {
      console.error("Error getting inscricao by rede:", error);
      throw error;
    }
  }

  // Remover pagamento
  async removePagamento(
    conferenciaId: string,
    redeId: string,
    pagamentoId: string
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const result = await collection.updateOne(
        { _id: new ObjectId(conferenciaId), "financeiro.rede._id": redeId },
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
        ]
      );
      return result;
    } catch (error) {
      console.error("Error removing pagamento from conferencia:", error);
      throw error;
    }
  }

  async updateAllowPastEdits(id: string, allowPastEdits: boolean): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName);
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { allowPastEdits, updatedAt: new Date() } }
    );
  }

  async toggleParticipanteIsento(
    conferenciaId: string,
    participanteId: string
  ): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const doc = await collection.findOne({ _id: new ObjectId(conferenciaId) });
      if (!doc) throw new Error("Conferência não encontrada");

      const participante = (doc.participantes || []).find(
        (p: any) => p._id === participanteId
      );
      if (!participante) throw new Error("Participante não encontrado");

      const novoIsento = !participante.isento;

      const result = await collection.updateOne(
        { _id: new ObjectId(conferenciaId) },
        [
          {
            $set: {
              participantes: {
                $map: {
                  input: "$participantes",
                  as: "p",
                  in: {
                    $cond: {
                      if: { $eq: ["$$p._id", participanteId] },
                      then: { $mergeObjects: ["$$p", { isento: novoIsento }] },
                      else: "$$p",
                    },
                  },
                },
              },
              updatedAt: new Date(),
            },
          },
        ]
      );

      return { success: true, isento: novoIsento, result };
    } catch (error) {
      console.error("Error toggling participante isento:", error);
      throw error;
    }
  }
}

export { ConferenciaRepository };
