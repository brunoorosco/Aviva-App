import { AulaDiscipulado, CicloDiscipulado, Membro } from "@/domain/models/discupulado";
import { useHttpDelete, useHttpGet, useHttpPost, useHttpPut } from "./api";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = "/api/protected/churches";

// Hook genérico para GET
function useFetch<T>(url: string | null, enabled = true) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !url) return;
    setIsLoading(true);
    try {
      const response = await axios.get<T>(url);
      if (!response.data) throw new Error("Erro ao carregar dados");
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Hook genérico para mutations (POST/DELETE)
function useMutate<TData, TResult = TData>(
  mutationFn: (data: TData) => Promise<TResult>,
  onSuccess?: () => void,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (data: TData) => {
    setIsLoading(true);
    try {
      const result = await mutationFn(data);
      onSuccess?.();
      return result;
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}

// Membros
export function useMembros(churchId?: string) {
  return useFetch<Membro[]>(churchId ? `${API_BASE}/${churchId}/discipulado/membros` : null);
}

// Ciclos
export function useCiclos(churchId?: string) {
  return useFetch<CicloDiscipulado[]>(churchId ? `${API_BASE}/${churchId}/discipulado/ciclos` : null);
}

export function useCreateCiclo(churchId?: string, onSuccess?: () => void) {
  const { refetch } = useCiclos(churchId);
  return useMutate(
    async (ciclo: Omit<CicloDiscipulado, "id">) => {
      if (!churchId) throw new Error("Church ID required");
      const response = await useHttpPost({ url: `${API_BASE}/${churchId}/discipulado/ciclos`, data: ciclo });
      if (!response) throw new Error("Erro ao criar ciclo");
      return response as CicloDiscipulado;
    },
    () => {
      refetch();
      onSuccess?.();
    },
  );
}

// Aulas
export function useAulas(churchId?: string, cicloId?: string) {
  const url = churchId
    ? `${API_BASE}/${churchId}/discipulado/aulas${cicloId ? `?cicloId=${cicloId}` : ""}`
    : null;
  return useFetch<AulaDiscipulado[]>(url);
}

// Aula por ID
export function useAulaById(churchId?: string, aulaId?: string) {
  const url = churchId && aulaId
    ? `${API_BASE}/${churchId}/discipulado/aulas/${aulaId}`
    : null;
  return useFetch<AulaDiscipulado>(url);
}

// Create aula
export function useCreateAula(churchId?: string, onSuccess?: () => void) {
  const { refetch } = useAulas(churchId, undefined); // ✅ adicionar refetch

  return useMutate(
    async (aula: Omit<AulaDiscipulado, "id" | "createdAt">) => {
      if (!churchId) throw new Error("Church ID required");
      const response = await useHttpPost({ url: `${API_BASE}/${churchId}/discipulado/aulas`, data: aula });
      if (!response) throw new Error("Erro ao criar aula");
      return response as AulaDiscipulado;
    },
    () => {
      refetch(); // ✅ revalida lista após criar
      onSuccess?.();
    },
  );
}

// Update aula
export function useUpdateAula(churchId?: string, onSuccess?: () => void) {
  const { refetch } = useAulas(churchId, undefined);
  return useMutate(
    async (aula: AulaDiscipulado) => {
      if (!churchId) throw new Error("Church ID required");
      const response = await useHttpPut({ url: `${API_BASE}/${churchId}/discipulado/aulas/${aula.id}`, data: aula });
      if (!response) throw new Error("Erro ao atualizar aula");
      return response as AulaDiscipulado;
    },
    () => {
      refetch();
      onSuccess?.();
    },
  );
}

// Delete aula
export function useDeleteAula(churchId?: string, onSuccess?: () => void) {
  const { refetch } = useAulas(churchId, undefined);
  return useMutate(
    async (id: string) => {
      if (!churchId) throw new Error("Church ID required");
      const response = await useHttpDelete({ url: `${API_BASE}/${churchId}/discipulado/aulas/${id}` });
      if (!response) throw new Error("Erro ao excluir aula");
    },
    () => {
      refetch();
      onSuccess?.();
    },
  );
}

// Pendências
export function usePendencias(churchId?: string, cicloId?: string) {
  const url = churchId && cicloId
    ? `${API_BASE}/${churchId}/discipulado/pendencias?cicloId=${cicloId}`
    : null;
  return useFetch<{ membroId: string; nome: string; rede: { name: string; _id: string }; aulasPendentes: string[] }[]>(url, !!url);
}

// Inscrições
export function useAddInscrito(churchId?: string, cicloId?: string, onSuccess?: () => void) {
  const { refetch } = useCiclos(churchId);
  return useMutate(
    async (inscrito: Membro) => {
      if (!churchId || !cicloId) throw new Error("Church ID and Ciclo ID required");
      const response = await useHttpPost({ url: `${API_BASE}/${churchId}/discipulado/ciclos/${cicloId}/inscricao`, data: inscrito });
      if (!response) throw new Error("Erro ao matricular no ciclo");
      return response;
    },
    () => {
      refetch();
      onSuccess?.();
    },
  );
}

export function useRemoveInscrito(churchId?: string, cicloId?: string, onSuccess?: () => void) {
  const { refetch } = useCiclos(churchId);
  return useMutate(
    async (membroId: string) => {
      if (!churchId || !cicloId) throw new Error("Church ID and Ciclo ID required");
      const url = `${API_BASE}/${churchId}/discipulado/ciclos/${cicloId}/inscricao`;
      // useHttpDelete doesn't easily support body in this generic fetcher, but fetch supports body in DELETE.
      // We will fallback to axios or fetch for this specifically if needed. Use axios directly to be safe:
      const response = await import("axios").then(axios => axios.default.delete(url, { data: { membroId } }));
      if (!response.data) throw new Error("Erro ao remover matrícula");
      return response.data;
    },
    () => {
      refetch();
      onSuccess?.();
    },
  );
}

// Usuários Ativos com Rede
export function useActiveUsersWithNetwork(churchId?: string) {
  return useFetch<
    {
      _id: string;
      name: string;
      email: string;
      role: string;
      rede: { name: string; _id: string } | null;
    }[]
  >(churchId ? `${API_BASE}/${churchId}/users/active` : null);
}
