import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { EncontristasSection } from "@/components/finance/EncontristasSection";
import { EquipeSection } from "@/components/finance/EquipeSection";
import { PagamentosSection } from "@/components/finance/PagamentosSection";
import { ResumoFinanceiro } from "@/components/finance/ResumoFinanceiro";
import { Pagamento, TEquipe, TPeople } from "@/domain/models/encontroComDeus";
import { useHttpPost } from "@/hooks/api";
import Toast from "@/components/Toast";

let idCounter = 0;
const nextId = () => String(++idCounter);

export default function GroupFinance() {
  const navigate = useRouter();
  const { data: session } = useSession();
  const { churchid, encontroId } = navigate.query;

  const [encontristas, setEncontristas] = useState<TPeople[]>([]);
  const [equipeMembers, setEquipeMembers] = useState<TEquipe[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Encontristas
  const addEncontrista = (data: TPeople) => {
    setEncontristas((prev) => [
      ...prev,
      {
        _id: nextId(),
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        endereco: data.endereco,
        isento: data.isento,
        dataNascimento: data.dataNascimento,
        idade: data.idade,
      },
    ]);
  };
  const editEncontrista = (id: string, data: TPeople) => {
    setEncontristas((prev) =>
      prev.map((e) =>
        e._id === id
          ? {
              ...e,
              name: data.nome,
              telefone: data.telefone,
              email: data.email,
              endereco: data.endereco,
              isento: data.isento,
            }
          : e,
      ),
    );
  };
  const removeEncontrista = (id: string) => {
    setEncontristas((prev) => prev.filter((e) => e._id !== id));
  };
  const linkEquipe = (encontristaId: string, equipeMembroId: string | undefined) => {
    setEncontristas((prev) =>
      prev.map((e) => (e._id === encontristaId ? { ...e, equipeMembroId } : e)),
    );
  };

  // Equipe
  const addEquipeMember = (user: TEquipe) => {
    setEquipeMembers((prev) => [
      ...prev,
      { _id: user._id, name: user.name, isento: false, rede: user.rede },
    ]);
  };
  const removeEquipeMember = (id: string) => {
    setEncontristas((prev) =>
      prev.map((e) => (e._id === id ? { ...e, equipeMembroId: undefined } : e)),
    );
    setEquipeMembers((prev) => prev.filter((m) => m._id !== id));
  };
  const toggleIsentoEquipe = (id: string) => {
    setEquipeMembers((prev) => prev.map((m) => (m._id === id ? { ...m, isento: !m.isento } : m)));
  };

  // Pagamentos
  const addPagamento = (p: Omit<Pagamento, "_id" | "data">) => {
    setPagamentos((prev) => [...prev, { ...p, _id: nextId(), data: new Date().toISOString() }]);
  };
  const removePagamento = (id: string) => {
    setPagamentos((prev) => prev.filter((p) => p._id !== id));
  };

  const totalPago = useMemo(() => pagamentos.reduce((sum, p) => sum + p.valor, 0), [pagamentos]);

  const handleSave = async () => {
    if (!encontroId) {
      alert("ID do encontro não encontrado");
      return;
    }

    if (!session?.user?.cem) {
      alert("Informações da rede/célula não encontradas");
      return;
    }

    // Valida se tem pelo menos um encontrista ou equipe
    if (encontristas.length === 0 && equipeMembers.length === 0) {
      alert("Adicione pelo menos um encontrista ou membro da equipe");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        encontristas,
        equipeMembers,
        rede: {
          _id: session.user.cem._id,
          name: session.user.cem.name,
        },
        financeiro: {
          pagamento: pagamentos, // Array de pagamentos
        },
      };

      console.log("Enviando dados:", payload);

      const response = await useHttpPost({
        url: `/api/protected/churches/${churchid}/encontroComDeus/inscricao?encontroId=${encontroId}`,
        data: payload,
      });

      if (response.result.success) {
        Toast.showSuccess("Inscrição salva com sucesso!");
        navigate.back();
      } else {
        throw new Error(response.error || "Erro ao salvar inscrição");
      }
    } catch (error: any) {
      console.error("Erro ao salvar inscrição:", error);
      alert(error?.message || "Erro ao salvar inscrição. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4 justify-between">
          <div className="flex">
            <Button variant="ghost" size="icon" onClick={() => navigate.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold font-[Montserrat]">Inscrição Encontro com Deus</h1>
              <p className="text-xs text-muted-foreground">
                Gerenciamento de encontristas e equipe
              </p>
            </div>
          </div>
          <div>
            <Button
              onClick={handleSave}
              disabled={isLoading || (encontristas.length === 0 && equipeMembers.length === 0)}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <ResumoFinanceiro
          encontristas={encontristas}
          equipeMembers={equipeMembers}
          pagamentos={pagamentos}
          totalPago={totalPago}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EncontristasSection
            encontristas={encontristas}
            equipeMembers={equipeMembers}
            onAdd={addEncontrista}
            onEdit={editEncontrista}
            onRemove={removeEncontrista}
            onLinkEquipe={linkEquipe}
          />
          <EquipeSection
            equipeMembers={equipeMembers}
            onAdd={addEquipeMember}
            onRemove={removeEquipeMember}
            onToggleIsento={toggleIsentoEquipe}
          />
        </div>

        <PagamentosSection
          pagamentos={pagamentos}
          onAdd={addPagamento}
          onRemove={removePagamento}
        />
      </div>
    </div>
  );
}
