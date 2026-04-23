import { IRolePermission, PermissionsMongoRepository } from "../infra/db/repositories/mongo/permissions";

export const getPermissionsService = async (): Promise<IRolePermission[]> => {
  const repo = new PermissionsMongoRepository();
  return await repo.getAll();
};

export const updateRolePermissionsService = async (role: string, modules: any[]): Promise<any> => {
  const repo = new PermissionsMongoRepository();
  return await repo.updateByRole(role, { modules });
};

export const getPermissionsByRoleService = async (role: string): Promise<IRolePermission | null> => {
  const repo = new PermissionsMongoRepository();
  return await repo.getByRole(role);
};
