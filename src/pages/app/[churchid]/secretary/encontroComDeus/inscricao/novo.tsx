import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { EncontristasSection } from "@/components/finance/EncontristasSection";
import { EquipeSection } from "@/components/finance/EquipeSection";
import { PagamentosSection } from "@/components/finance/PagamentosSection";
import { ResumoFinanceiro } from "@/components/finance/ResumoFinanceiro";
import { Pagamento, TEquipe, TPeople } from "@/domain/models/encontroComDeus";

let idCounter = 0;
const nextId = () => String(++idCounter);

export default function GroupFinance() {
  const navigate = useRouter();

  const [encontristas, setEncontristas] = useState<TPeople[]>([]);
  const [equipeMembers, setEquipeMembers] = useState<TEquipe[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
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
