import { TMinisterialLevel } from "@/domain/models/ministerial";
import { ObjectId } from "mongodb";
import { MongoHelper } from "../../mongoHelper";

export class ConsagracaoRepository {
  private collectionName: string;
  constructor() {
    this.collectionName = "churchs";
  }

  async getConsagracaoById(churchId: string, id: string): Promise<any> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName);
      const consagracao = await collection.findOne(
        {
          _id: new ObjectId(churchId),
          "consagracao._id": new ObjectId(id),
        },
        {
          projection: {
            "consagracao.$": 1,
          },
        }
      );
      return consagracao;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async getConsagracaoByChurch(churchId: string): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const pipeline = [
      { $match: { _id: new ObjectId(churchId) } },
      { $unwind: "$consagracao" },

      {
        $addFields: {
          safeUsers: {
            $ifNull: ["$consagracao.users", {}],
          },
        },
      },
      {
        $addFields: {
          usersArray: {
            $map: {
              input: { $objectToArray: "$safeUsers" },
              as: "item",
              in: {
                k: "$$item.k",
                v: { $ifNull: ["$$item.v", []] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          allUsers: {
            $reduce: {
              input: "$usersArray",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this.v"] },
            },
          },
        },
      },
      {
        $addFields: {
          totalConsagrated: { $size: "$allUsers" },

          rolesConsagrated: {
            $map: {
              input: "$usersArray",
              as: "r",
              in: {
                role: "$$r.k",
                count: { $size: "$$r.v" },
              },
            },
          },
        },
      },

      { $replaceRoot: { newRoot: "$consagracao" } },
    ];

    return await collection.aggregate(pipeline).toArray();
  }

  async createConsagracao(churchId: string, date: Date): Promise<any> {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const parsedDate = new Date(date);

    // 1️⃣ Verificar se já existe consagração na mesma data
    const exists = await collection.findOne({
      _id: new ObjectId(churchId),
      "consagracao.date": parsedDate,
    });

    if (exists) {
      throw new Error("Já existe uma consagração cadastrada para esta data.");
    }

    // 2️⃣ Criar subdocumento
    const newConsagracao = {
      _id: new ObjectId(),
      date: parsedDate,
      totalConsagrated: 0,
      rolesConsagrated: {},
    };

    // 3️⃣ Inserir no array
    const result = await collection.updateOne(
      { _id: new ObjectId(churchId) },
      {
        //@ts-ignore
        $push: {
          consagracao: newConsagracao,
        },
      }
    );

    return {
      inserted: result.modifiedCount === 1,
      consagracao: newConsagracao,
    };
  }

  async addCargo(
    churchId: string,
    consagracaoId: string,
    nextRole: string,
    users: {
      name: string;
      id: string;
      rede: string;
      role: TMinisterialLevel;
      nextRole: TMinisterialLevel;
    }[]
  ) {
    const collection = await MongoHelper.getCollection(this.collectionName);

    const normalizedRole = nextRole;

    const updatePath = `consagracao.$.users.${normalizedRole}`;

    // 1 — Atualizar substituindo toda a lista desse nextRole
    return collection.updateOne(
      {
        _id: new ObjectId(churchId),
        "consagracao._id": new ObjectId(consagracaoId),
      },
      {
        $set: {
          [updatePath]: users, // sobrescreve completamente a lista desse cargo
        },
      }
    );
  }
}
