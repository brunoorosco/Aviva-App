import { AulaDiscipulado, CicloDiscipulado, Membro } from "@/domain/models/discupulado";
import { useHttpDelete, useHttpGet, useHttpPost } from "./api";
import { useState, useEffect, useCallback } from "react";

const API_BASE = "/api";

// Hook genérico para GET
function useFetch<T>(url: string, enabled = true) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const response = await useHttpGet(url);
      if (!response) throw new Error("Erro ao carregar dados");
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
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
export function useMembros() {
  return useFetch<Membro[]>(`${API_BASE}/membros`);
}

// Ciclos
export function useCiclos() {
  return useFetch<CicloDiscipulado[]>(`${API_BASE}/discipulado/ciclos`);
}

// Aulas
export function useAulas(cicloId?: string) {
  const url = cicloId
    ? `${API_BASE}/discipulado/aulas?cicloId=${cicloId}`
    : `${API_BASE}/discipulado/aulas`;
  return useFetch<AulaDiscipulado[]>(url);
}

// Create aula
export function useCreateAula(onSuccess?: () => void) {
  const { data: aulas, refetch } = useAulas();
  return useMutate(
    async (aula: Omit<AulaDiscipulado, "id" | "createdAt">) => {
      const response = await useHttpPost(`${API_BASE}/discipulado/aulas`, aula);
      if (!response) throw new Error("Erro ao criar aula");
      return response.data as AulaDiscipulado;
    },
    () => {
      refetch();
      onSuccess?.();
    },
  );
}

// Update aula
export function useUpdateAula(cicloId?: string, onSuccess?: () => void) {
  const { refetch } = useAulas(cicloId);
  return useMutate(
    async (aula: AulaDiscipulado) => {
      const response = await useHttpPost(`${API_BASE}/discipulado/aulas/${aula.id}`, aula);
      if (!response) throw new Error("Erro ao atualizar aula");
      return response.data as AulaDiscipulado;
    },
    () => {
      refetch();
      onSuccess?.();
    },
  );
}

// Delete aula
export function useDeleteAula(cicloId?: string, onSuccess?: () => void) {
  const { refetch } = useAulas(cicloId);
  return useMutate(
    async (id: string) => {
      const response = await useHttpDelete(`${API_BASE}/discipulado/aulas/${id}`);
      if (!response) throw new Error("Erro ao excluir aula");
    },
    () => {
      refetch();
      onSuccess?.();
    },
  );
}

// Pendências
export function usePendencias(cicloId?: string) {
  return useFetch<{ membroId: string; nome: string; celula: string; aulasPendentes: string[] }[]>(
    `${API_BASE}/discipulado/pendencias?cicloId=${cicloId}`,
    !!cicloId,
  );
}
