import { CellsMongoRepository } from "../infra/db/repositories/mongo/cells";
import { ObjectId } from "mongodb";

const createCemService = async (data: any, churchesId: string): Promise<any> => {
  const cemRepository = new CellsMongoRepository();
  const newCell = {
    name: data.name.toUpperCase(),
    number: data.number,
    cep: data.zipcode.replace("-", ""),
    city: data.city,
    street: data.street,
    state: data.state,
    _id: new ObjectId(),
  };
  const saved = await cemRepository.create(churchesId, newCell);
  return saved;
};

const updateCemService = async (churchId: string, cemId: string, data: any): Promise<any> => {
  const cemRepository = new CellsMongoRepository();
  const updateCell = {
    name: data.name.toUpperCase(),
    number: data.number,
    cep: data.zipcode ? data.zipcode.replace("-", "") : "",
    city: data.city ?? data.city,
    street: data.street ?? data.street,
    state: data.state ?? data.state,
  };
  const saved = await cemRepository.update(churchId, cemId, updateCell);
  return saved;
};

const getCemService = async (churchid: string) => {
  const cemRepository = new CellsMongoRepository();
  const result = await cemRepository.getCells(churchid);

  return result;
};

const getCemByIdService = async (churchid: string, cemId: string) => {
  const cemRepository = new CellsMongoRepository();
  const result = await cemRepository.getCellsById(churchid, cemId);
  console.log("cemService.ts:32", result);
  return result;
};

const deleteCemService = async (churchId: string, cemId: string) => {
  const cemRepository = new CellsMongoRepository();
  const result = await cemRepository.delete(churchId, cemId);
  return result;
};

// const getCembyUserId = async (email: string) => {
//   const church = await prisma.user.findUnique({
//     where: {
//       email
//     },
//     include: {
//       UserCEM: {
//         include: {
//           cem: true
//         }
//       }
//     }
//   })

//   const cem = church?.UserCEM[0].cem

//   return cem
// }

export { getCemByIdService, getCemService, deleteCemService, createCemService, updateCemService };
