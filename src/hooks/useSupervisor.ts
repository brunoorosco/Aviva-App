import { useHttpGet } from './api'

type TSupervisores = {
  id: string
  name: string
}
type TProfile = {
  id: string
  description: string
}

export function useSupervisor() {
  const { data: profile, error } = useHttpGet<TProfile[]>(`/api/protected/app/`)

  const {
    data: supervisores,
    error: errorRequest,
    isLoading
  } = useHttpGet<TSupervisores[]>(`/api/protected/app/`)

  return supervisores
}
