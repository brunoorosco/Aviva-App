// lib/auth-guard.ts
import { getServerSession } from 'next-auth';
import { hasPermission } from './permissions';

export async function requirePermissions(requiredRoles: string[]) {
  const session = await getServerSession();
  
  if (!session) {
    throw new Error('Não autenticado');
  }

  const userRoles = [
    session.user?.role,
    ...(session.user?.permission ?? [])
  ].filter(Boolean) as string[];

  if (!hasPermission(userRoles, requiredRoles)) {
    throw new Error('Sem permissão');
  }

  return session;
}