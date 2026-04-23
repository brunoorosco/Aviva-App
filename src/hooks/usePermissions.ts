import { useSession } from 'next-auth/react';
import { hasPermission, hasMinimumRole, type Role, checkModulePermission, RolePermission } from '@/lib/permissions';
import { useHttpGet } from './api';
import { useRouter } from 'next/router';

export function usePermissions() {
  const { data: session } = useSession();
  const router = useRouter();
  const { churchid } = router.query;

  // Busca as definições de permissão do banco
  const { data: allPermissions, isLoading } = useHttpGet<RolePermission[]>(
    churchid ? `/api/protected/churches/${churchid}/admin/permissions` : null
  );
  
  const userRoles = [
    session?.user?.role,
    ...(session?.user?.permission ?? [])
  ].filter(Boolean) as string[];

  const can = (moduleName: string, action: "read" | "write" | "edit" | "delete") => {
    if (!session?.user || !allPermissions) return false;
    return checkModulePermission(userRoles, allPermissions.data || [], moduleName, action);
  };

  return {
    userRoles,
    hasPermission: (requiredRoles: string[]) => hasPermission(userRoles, requiredRoles),
    hasMinimumRole: (minimumRole: Role) => hasMinimumRole(userRoles, minimumRole),
    can,
    isAdmin: userRoles.includes('admin'),
    isLoadingPermissions: isLoading
  };
}