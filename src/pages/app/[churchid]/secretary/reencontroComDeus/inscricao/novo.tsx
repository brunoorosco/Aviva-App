import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Network } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

let idCounter = 0;
const nextId = () => String(++idCounter);

type TRede = { _id: string; name: string };

const PRIVILEGED_PERMISSIONS = ["ADMIN_CHURCH", "SUPERADMIN", "secretaria"];

export default function GroupFinance() {
  const navigate = useRouter();
  const { data: session } = useSession();
  const { churchid, reencontroId } = navigate.query;

  const isPrivileged = session?.user?.permission?.some((p: string) =>
    PRIVILEGED_PERMISSIONS.includes(p)
  ) ?? false;

  const [reencontristas, setReencontristas] = useState<TPeople[]>([]);
  const [equipeMembers, setEquipeMembers] = useState<TEquipe[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [reencontroInfo, setReencontroInfo] = useState<any>(null);
  const [redes, setRedes] = useState<TRede[]>([]);
  const [selectedRede, setSelectedRede] = useState<TRede | null>(null);

  // Reencontristas
  const addReencontrista = (data: TPeople) => {
    setReencontristas((prev) => [
      ...prev,
      {
        _id: data._id || nextId(),
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
  const editReencontrista = (id: string, data: TPeople) => {
    setReencontristas((prev) =>
      prev.map((e) =>
        e._id === id
          ? {
            ...e,
            ...data,
          }
          : e,
      ),
    );
  };
  const removeReencontrista = (id: string) => {
    setReencontristas((prev) => prev.filter((e) => e._id !== id));
  };
  const linkEquipe = (reencontristaId: string, equipeMembroId: string | undefined) => {
    setReencontristas((prev) =>
      prev.map((e) => (e._id === reencontristaId ? { ...e, equipeMembroId } : e)),
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
    setReencontristas((prev) =>
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
        await fetch(`/api/protected/churches/${churchid}/reencontroComDeus/comprovante/delete`, {
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

  // Carregar lista de redes se for usuário privilegiado
  useEffect(() => {
    if (!isPrivileged || !churchid) return;
    fetch(`/api/protected/churches/${churchid}/redes`)
      .then((res) => res.json())
      .then((data: TRede[]) => {
        if (Array.isArray(data)) {
          setRedes(data);
          const myRede = data.find((r) => r._id === session?.user?.cem?._id);
          setSelectedRede(myRede ?? data[0] ?? null);
        }
      })
      .catch(console.error);
  }, [isPrivileged, churchid, session?.user?.cem?._id]);

  // Carregar dados existentes ao abrir a página
  useEffect(() => {
    const loadInscricaoData = async () => {
      if (!reencontroId) {
        setIsLoadingData(false);
        return;
      }

      const redeId = isPrivileged ? selectedRede?._id : session?.user?.cem?._id;
      if (!redeId) {
        setIsLoadingData(false);
        return;
      }

      try {
        setIsLoadingData(true);

        const response = await fetch(
          `/api/protected/churches/${churchid}/reencontroComDeus/inscricao?reencontroId=${reencontroId}&redeId=${redeId}`,
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const data = await response.json();

        if (data.reencontristas && Array.isArray(data.reencontristas)) {
          setReencontristas(data.reencontristas);
        }

        if (data.equipe && Array.isArray(data.equipe)) {
          setEquipeMembers(data.equipe);
        }

        if (data.financeiro?.pagamento && Array.isArray(data.financeiro.pagamento)) {
          setPagamentos(data.financeiro.pagamento);
        }

        if (data.reencontro) {
          setReencontroInfo(data.reencontro);
        }

        console.log("Dados carregados:", data);
      } catch (error) {
        console.error("Erro ao carregar dados da inscrição:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadInscricaoData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reencontroId, churchid, selectedRede?._id, session?.user?.cem?._id]);

  const handleSave = async () => {
    if (!reencontroId) {
      Toast.showError("ID do reencontro não encontrado");
      return;
    }

    const redeToSave = isPrivileged
      ? selectedRede
      : session?.user?.cem
        ? { _id: session.user.cem._id, name: session.user.cem.name }
        : null;

    if (!redeToSave) {
      Toast.showError("Selecione uma rede antes de salvar");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        reencontristas,
        equipeMembers,
        rede: redeToSave,
        financeiro: {
          pagamento: pagamentos,
        },
      };

      const response = await useHttpPost({
        url: `/api/protected/churches/${churchid}/reencontroComDeus/inscricao?reencontroId=${reencontroId}`,
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
      Toast.showError(error?.message || "Erro ao salvar inscrição. Tente novamente.");
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
                Inscrição Reencontro com Deus
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {reencontroInfo
                  ? `Reencontro #${reencontroInfo.numero}`
                  : "Gerenciamento de reencontristas e equipe"}
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

        {/* Seletor de rede para usuários privilegiados */}
        {isPrivileged && redes.length > 0 && (
          <div className="max-w-6xl mx-auto px-2 sm:px-4 pb-3 flex items-center gap-2">
            <Network className="h-4 w-4 text-orange-500 shrink-0" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">Inserindo para a rede:</span>
            <Select
              value={selectedRede?._id ?? ""}
              onValueChange={(value) => {
                const rede = redes.find((r) => r._id === value);
                if (rede) {
                  setSelectedRede(rede);
                  setReencontristas([]);
                  setEquipeMembers([]);
                  setPagamentos([]);
                }
              }}
            >
              <SelectTrigger className="h-8 text-xs max-w-xs border-orange-500/40 bg-orange-500/5 focus:ring-orange-500">
                <SelectValue placeholder="Selecione a rede..." />
              </SelectTrigger>
              <SelectContent>
                {redes.map((r) => (
                  <SelectItem key={r._id} value={r._id} className="text-xs">
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <ResumoFinanceiro
          encontristas={reencontristas}
          equipeMembers={equipeMembers}
          pagamentos={pagamentos}
          totalPago={totalPago}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EncontristasSection
            encontristas={reencontristas}
            onAdd={addReencontrista}
            onEdit={editReencontrista}
            onRemove={removeReencontrista}
            onLinkEquipe={linkEquipe}
          />
          <EquipeSection
            equipeMembers={equipeMembers}
            onAdd={addEquipeMember}
            onRemove={removeEquipeMember}
            onToggleIsento={toggleIsentoEquipe}
            cemId={isPrivileged ? selectedRede?._id : undefined}
            cemName={isPrivileged ? selectedRede?.name : undefined}
          />
        </div>

        <PagamentosSection
          pagamentos={pagamentos}
          onAdd={addPagamento}
          onRemove={removePagamento}
          customFolder={reencontroInfo?.numero ? `comprovantes/reencontro/${reencontroInfo.numero}` : 'comprovantes/reencontro'}
        />
      </div>
    </div>
  );
}
