/**
 * Verifica se uma session/user qualquer tem perfil de administrador da igreja.
 *
 * Convenção do app (ver batismo/[id]/index.ts:21-28 e usePermissions.ts):
 *   - role em { bispo, admin } (case-insensitive, whitespace-trimmed)
 *   - permission[] contém "admin" (case-insensitive)
 *
 * Aceita tanto session (do next-auth) quanto o doc do banco.
 */
export function isAdminUser(sessionLike?: {
  user?: { role?: string | null; permission?: readonly string[] | string | null } | null
} | null): boolean {
  if (!sessionLike?.user) return false;
  const u = sessionLike.user;

  const role = (u.role || '').toString().toLowerCase().trim();
  const roleOk = role === 'bispo' || role === 'admin';

  const permission = Array.isArray(u.permission)
    ? u.permission
    : typeof u.permission === 'string' && u.permission
      ? [u.permission]
      : [];
  const permOk = permission.some((p) => String(p).toLowerCase().trim() === 'admin');

  return roleOk || permOk;
}