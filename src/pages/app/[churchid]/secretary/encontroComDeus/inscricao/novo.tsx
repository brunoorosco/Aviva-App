import { useState, useMemo, useEffect } from "react";
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [encontroInfo, setEncontroInfo] = useState<any>(null);

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
        sexo: data.sexo,
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
  const removePagamento = async (id: string) => {
    const pagamento = pagamentos.find((p) => p._id === id);

    // Se tem comprovante, deleta do Cloudinary primeiro
    if (pagamento?.comprovantePublicId || pagamento?.comprovanteUrl) {
      try {
        await fetch(`/api/protected/churches/${churchid}/encontroComDeus/comprovante/delete`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicId: pagamento.comprovantePublicId,
            url: pagamento.comprovanteUrl,
          }),
        });
      } catch (error) {
        console.error("Erro ao deletar comprovante do Cloudinary:", error);
      }
    }

    setPagamentos((prev) => prev.filter((p) => p._id !== id));
  };

  const totalPago = useMemo(() => pagamentos.reduce((sum, p) => sum + p.valor, 0), [pagamentos]);

  // Carregar dados existentes ao abrir a página
  useEffect(() => {
    const loadInscricaoData = async () => {
      if (!encontroId || !session?.user?.cem?._id) {
        setIsLoadingData(false);
        return;
      }

      try {
        setIsLoadingData(true);
        const redeId = session.user.cem._id;

        const response = await fetch(
          `/api/protected/churches/${churchid}/encontroComDeus/inscricao?encontroId=${encontroId}&redeId=${redeId}`,
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const data = await response.json();

        // Carregar encontristas
        if (data.encontristas && Array.isArray(data.encontristas)) {
          setEncontristas(data.encontristas);
        }

        // Carregar equipe
        if (data.equipe && Array.isArray(data.equipe)) {
          setEquipeMembers(data.equipe);
        }

        // Carregar pagamentos
        if (data.financeiro?.pagamento && Array.isArray(data.financeiro.pagamento)) {
          setPagamentos(data.financeiro.pagamento);
        }

        // Salvar info do encontro
        if (data.encontro) {
          setEncontroInfo(data.encontro);
        }

        console.log("Dados carregados:", data);
      } catch (error) {
        console.error("Erro ao carregar dados da inscrição:", error);
        // Não mostrar erro se for primeira vez (dados não existem ainda)
      } finally {
        setIsLoadingData(false);
      }
    };

    loadInscricaoData();
  }, [encontroId, churchid, session?.user?.cem?._id]);

  const handleSave = async () => {
    if (!encontroId) {
      alert("ID do encontro não encontrado");
      return;
    }

    if (!session?.user?.cem) {
      alert("Informações da rede/célula não encontradas");
      return;
    }

    // Não valida mais se está vazio - permite limpar dados
    // Isso permite que o usuário apague tudo para remover inscrição

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

  // Mostrar loading enquanto carrega os dados
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate.back()} className="shrink-0 h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold font-[Montserrat] leading-tight truncate sm:whitespace-normal">
                Inscrição Encontro com Deus
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {encontroInfo
                  ? `Encontro #${encontroInfo.numero}`
                  : "Gerenciamento de encontristas e equipe"}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-9 sm:h-10 px-4 sm:px-8"
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
          customFolder={encontroInfo?.numero ? `comprovantes/encontro/${encontroInfo.numero}` : 'comprovantes/encontro'}
        />
      </div>
    </div>
  );
}
