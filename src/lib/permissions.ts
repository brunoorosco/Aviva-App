// lib/permissions.ts
export const ROLES = {
  ADMIN: "admin",
  PASTOR: "pastor",
  SECRETARIA: "secretaria",
  SUPERVISOR: "supervisor",
  LIDER: "lider",
  AUXILIAR: "auxiliar",
  BOAS_VINDAS: "boas-vindas",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Hierarquia de permissões
const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.ADMIN]: 100,
  [ROLES.PASTOR]: 80,
  [ROLES.SECRETARIA]: 60,
  [ROLES.SUPERVISOR]: 50,
  [ROLES.LIDER]: 30,
  [ROLES.BOAS_VINDAS]: 20,
  [ROLES.AUXILIAR]: 10,
};

export function hasPermission(userRoles: string[], requiredRoles: string[]): boolean {
  if (userRoles.includes(ROLES.ADMIN)) return true;
  return requiredRoles.some((role) => userRoles.includes(role));
}

export function hasMinimumRole(userRoles: string[], minimumRole: Role): boolean {
  if (userRoles.includes(ROLES.ADMIN)) return true;

  const userMaxLevel = Math.max(...userRoles.map((role) => ROLE_HIERARCHY[role as Role] ?? 0));
  const requiredLevel = ROLE_HIERARCHY[minimumRole];

  return userMaxLevel >= requiredLevel;
}

export interface ModulePermission {
  name: string;
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
}

export interface RolePermission {
  role: string;
  modules: ModulePermission[];
}

/**
 * Verifica se o usuário tem uma permissão específica em um módulo,
 * baseando-se no conjunto de regras dinâmicas carregadas do banco.
 */
export function checkModulePermission(
  userRoles: string[],
  allRolePermissions: RolePermission[],
  moduleName: string,
  action: "read" | "write" | "edit" | "delete"
): boolean {
  // Admin sempre tem permissão total
  if (userRoles.includes(ROLES.ADMIN)) return true;

  // Verifica cada papel do usuário
  return userRoles.some((role) => {
    const roleRules = allRolePermissions.find((p) => p.role === role);
    if (!roleRules) return false;

    const moduleRule = roleRules.modules.find((m) => m.name === moduleName);
    if (!moduleRule) return false;

    return !!moduleRule[action];
  });
}
