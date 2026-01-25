// components/PermissionGuard.tsx
import { usePermissions } from "@/hooks/usePermission";
import { type Role } from "@/lib/permissions";

type PermissionGuardProps = {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function PermissionGuard({ roles, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
