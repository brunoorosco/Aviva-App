/**
 * Checa se a session/user pode preencher a tela de "Apresentação de Crianças".
 *
 * Regra (convenção do app):
 *   - role ∈ { admin, bispo }  OU
 *   - permission[] ∋ 'apresentacao_crianca'
 *   - permission[] ∋ 'admin'  (mesma convenção de isAdminUser)
 *
 * Aceita session do next-auth ou doc do banco (shape: { user?: { role, permission } }).
 */
export function hasCriancaAccess(
  sessionLike?: {
    user?: { role?: string | null; permission?: readonly string[] | string | null } | null
  } | null
): boolean {
  if (!sessionLike?.user) return false;
  const u = sessionLike.user;

  const role = (u.role || '').toString().toLowerCase().trim();
  if (role === 'admin' || role === 'bispo') return true;

  const permissions = (Array.isArray(u.permission)
    ? u.permission
    : typeof u.permission === 'string' && u.permission
      ? [u.permission]
      : [])
    .map((p) => String(p).toLowerCase().trim());
  return permissions.includes('apresentacao_crianca') || permissions.includes('admin');
}