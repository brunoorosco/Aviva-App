import { TMinisterialLevel } from "@/domain/models/ministerial";
import { User } from "@/domain/models/users";
import CryptAdapter from "@/infra/cryptography/bcrypt";
import { UsersMongoRepository } from "@/infra/db/repositories/mongo/users";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { AddressModel } from "@/domain/models/address";

type TUser = {
  name: string;
  email: string;
  phone: string;
  zipcode: string;
  street: string;
  number: string;
  city: string;
  cemId: string;
  birthDate: string;
  churchId: string;
};

export const createUserByCem = async (params: TUser) => {
  const userRepository = new UsersMongoRepository();
  const cripto = new CryptAdapter();

  const randowPass = await cripto.randonPassword();

  const setPassword = cripto.hashPassword(randowPass);
  const zipcode = params.zipcode?.replace("-", "");

  const user = await userRepository.create({
    ...params,
    permission: ["user"],
    zipcode,
    password: setPassword,
    createdAt: new Date(),
  });
  return user;
};
export const createUser = async (params: TUser) => {
  const userRepository = new UsersMongoRepository();
  const cripto = new CryptAdapter();

  const randowPass = await cripto.randonPassword();
  const setPassword = cripto.hashPassword(randowPass);
  const zipcode = params.zipcode?.replace("-", "");

  const cem = params.cemId.split("-");

  if (params && "cemId" in params) {
    //@ts-ignore
    delete params.cemId;
  }

  const user = await userRepository.create({
    ...params,
    permission: ["user"],
    zipcode,
    password: setPassword,
    cem: { _id: cem[0], name: cem[1] },
    createdAt: new Date(),
  });
  return user;
};

// export const getUserSupervisories = async (churchId: string) => {
//   const userRepository = new Users()
//   const supers = await userRepository.getUserSupervisories(churchId)
//   return supers
// }
// export const getUserSupervisoriesCem = async (
//   churchId: string,
//   cemId: string
// ) => {
//   const userRepository = new Users()
//   const supers = await userRepository.getUserSupervisoriesCem(churchId, cemId)
//   return supers
// }

// export const updatedUserCem = async (cemId: string, userId: string) => {
//   const userRepository = new Users()
//   const user = await userRepository.updatedUserCem(cemId, userId)
//   return user
// }

export const getUsersByCem = async (cemId: string, name: string) => {
  const userRepository = new UsersMongoRepository();
  const members = await userRepository.getUsersByCellId(cemId, name);

  return members;
};

export const getUsersByChurch = async (
  churchId: string,
  pageNumber: number,
  limitNumber: number,
  name?: string,
) => {
  const userRepository = new UsersMongoRepository();
  const users = await userRepository.getUsersByChurchId(churchId, pageNumber, limitNumber, name);

  return users;
};

export const getUserByName = async (churchId: string, name: string) => {
  const userRepository = new UsersMongoRepository();
  const users = await userRepository.getUserByName(churchId, name);
  return users;
};

export const updatePermissionAndPasswordUser = async (data: any) => {
  const { emails, password, permission } = data;
  const userRepository = new UsersMongoRepository();
  const cripto = new CryptAdapter();

  if (!emails || !password || !permission) {
    return NextResponse.json({ message: "Campos obrigatórios." }, { status: 400 });
  }

  const emailList = emails
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter((e: string) => e.length > 0);

  if (emailList.length === 0) {
    return NextResponse.json({ message: "Nenhum email válido informado." }, { status: 400 });
  }

  const hashedPassword = await cripto.hashPassword(password);

  const results: any[] = [];
  for (const email of emailList) {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      results.push({ email, updated: false, reason: "Usuário não encontrado" });
      continue;
    }

    let permissions: string[] = [];
    if (Array.isArray(user.permission)) {
      permissions = user.permission;
    } else if (typeof user.permission === "string") {
      permissions = [user.permission];
    }

    if (!permissions.includes(permission)) {
      permissions.push(permission);
    }

    await userRepository.updateByEmail({
      email,
      password: hashedPassword,
      permission: permissions,
    });

    results.push({ email, updated: true });
  }

  return NextResponse.json({
    message: "Usuários atualizados com sucesso!",
    results,
  });
};

export const getUsersByStatus = async (churchId: string, cargo: TMinisterialLevel) => {
  const userRepository = new UsersMongoRepository();

  const resp = await userRepository.getUsersByStatus(churchId, cargo);
  return resp;
};

export const getUserSettings = async (userId: string): Promise<Partial<User>> => {
  const userRepository = new UsersMongoRepository();
  const user = await userRepository.geUserById(userId);

  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  // Retorna apenas os dados necessários (sem senha)
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.street,
    image: user.image,
    cem: user.cem,
    role: user.role,
  };
};

export const updateUserSettings = async (
  userId: string,
  data: {
    name?: string;
    phone?: string;
    address?: string;
    image?: string;
    currentPassword?: string;
    newPassword?: string;
  },
): Promise<Partial<User>> => {
  const userRepository = new UsersMongoRepository();
  const cryptAdapter = new CryptAdapter();

  const user = await userRepository.geUserById(userId);

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Validar senha atual se estiver tentando mudar a senha
  if (data.currentPassword && data.newPassword) {
    const isPasswordValid = cryptAdapter.compare(data.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("Senha atual incorreta");
    }

    // Hash da nova senha usando CryptAdapter
    data.newPassword = cryptAdapter.hashPassword(data.newPassword);
  }

  const updateData: Partial<User> = {};

  if (data.name) {
    updateData.name = data.name;
  }

  if (data.phone) {
    updateData.phone = data.phone;
  }

  if (data.address) {
    // Se address é string, converter para AddressModel
    if (typeof data.address === "string") {
      updateData.address = {
        street: data.address,
        // Adicione outros campos conforme necessário
      } as AddressModel;
    } else {
      updateData.address = data.address;
    }
  }

  if (data.image) {
    updateData.image = data.image;
  }

  if (data.newPassword) {
    updateData.password = data.newPassword;
  }

  const updatedUser = await userRepository.updateSettings(userId, updateData);

  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    address: updatedUser.address,
    image: updatedUser.image,
  };
};

export const usersByCemEquipe = async (cemid: string) => {
  const userRepository = new UsersMongoRepository();

  const user = await userRepository.getUsersByCellIdEquipe(cemid);
  return user;
};
