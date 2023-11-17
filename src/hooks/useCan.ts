import { useSession } from 'next-auth/react'
import { validateUserPermissions } from '../utils/validateUserPermissions'

type UseCanParams = {
  permissions?: string[]
  roles?: string[]
}

export function useCan({ permissions, roles }: UseCanParams) {
  const { data: session } = useSession()
  const user = session?.user

  const userHasValidPermissions = validateUserPermissions({
    user: user!,
    permissions,
    roles
  })

  return userHasValidPermissions
}
