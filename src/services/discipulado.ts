import { AulaDiscipulado, CicloDiscipulado, Membro } from "@/domain/models/discupulado";

const API_BASE = "/api/protected/churches";

export const discipuladoApi = {
  // Membros
  getMembros: async (churchId: string): Promise<Membro[]> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/membros`);
    if (!response.ok) throw new Error("Erro ao buscar membros");
    return response.json();
  },

  // Ciclos
  getCiclos: async (churchId: string): Promise<CicloDiscipulado[]> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/ciclos`);
    if (!response.ok) throw new Error("Erro ao buscar ciclos");
    return response.json();
  },

  createCiclo: async (churchId: string, ciclo: Omit<CicloDiscipulado, "id">): Promise<CicloDiscipulado> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/ciclos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ciclo),
    });
    if (!response.ok) throw new Error("Erro ao criar ciclo");
    return response.json();
  },

  addInscrito: async (churchId: string, cicloId: string, inscrito: Membro): Promise<{ success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/ciclos/${cicloId}/inscricao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inscrito),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || "Erro ao matricular no ciclo");
    }
    return response.json();
  },

  removeInscrito: async (churchId: string, cicloId: string, membroId: string): Promise<{ success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/ciclos/${cicloId}/inscricao`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ membroId }),
    });
    if (!response.ok) throw new Error("Erro ao remover matrícula");
    return response.json();
  },

  // Aulas
  getAulas: async (churchId: string, cicloId: string): Promise<AulaDiscipulado[]> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/aulas?cicloId=${cicloId}`);
    if (!response.ok) throw new Error("Erro ao buscar aulas");
    return response.json();
  },

  createAula: async (churchId: string, aula: Omit<AulaDiscipulado, "id" | "createdAt">): Promise<AulaDiscipulado> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/aulas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aula),
    });
    if (!response.ok) throw new Error("Erro ao criar aula");
    return response.json();
  },

  updateAula: async (churchId: string, aula: AulaDiscipulado): Promise<AulaDiscipulado> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/aulas/${aula.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aula),
    });
    if (!response.ok) throw new Error("Erro ao atualizar aula");
    return response.json();
  },

  deleteAula: async (churchId: string, id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/aulas/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir aula");
  },

  // Pendências
  getPendencias: async (churchId: string, cicloId: string): Promise<{
    membroId: string;
    nome: string;
    celula: string;
    aulasPendentes: string[];
  }[]> => {
    const response = await fetch(`${API_BASE}/${churchId}/discipulado/pendencias?cicloId=${cicloId}`);
    if (!response.ok) throw new Error("Erro ao buscar pendências");
    return response.json();
  },
};
