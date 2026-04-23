import { usePermissions } from "@/hooks/usePermissions";
import { type Role } from "@/lib/permissions";

type PermissionGuardProps = {
  roles?: Role[];
  module?: string;
  action?: "read" | "write" | "edit" | "delete";
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function PermissionGuard({ 
  roles, 
  module, 
  action, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { hasPermission, can, isLoadingPermissions } = usePermissions();

  if (isLoadingPermissions) return null;

  // Se passou module e action, usa a lógica dinâmica
  if (module && action) {
    if (!can(module, action)) {
      return <>{fallback}</>;
    }
  } 
  // Senão, cai na lógica antiga de roles (fallback para compatibilidade)
  else if (roles && !hasPermission(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
