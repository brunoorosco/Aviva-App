// hooks/usePermissions.ts
import { useSession } from 'next-auth/react';
import { hasPermission, hasMinimumRole, type Role } from '@/lib/permissions';

export function usePermissions() {
  const { data: session } = useSession();
  
  const userRoles = [
    session?.user?.role,
    ...(session?.user?.permission ?? [])
  ].filter(Boolean) as string[];

  return {
    userRoles,
    hasPermission: (requiredRoles: string[]) => hasPermission(userRoles, requiredRoles),
    hasMinimumRole: (minimumRole: Role) => hasMinimumRole(userRoles, minimumRole),
    isAdmin: userRoles.includes('admin'),
  };
}