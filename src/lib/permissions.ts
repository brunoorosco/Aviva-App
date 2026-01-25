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
