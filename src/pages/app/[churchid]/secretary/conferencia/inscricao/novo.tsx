import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Network, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { PagamentosSection } from "@/components/finance/PagamentosSection";
import { ResumoFinanceiroConferencia } from "@/components/finance/ResumoFinanceiroConferencia";
import { Pagamento, TParticipante } from "@/domain/models/conferencia";
import { useHttpPost } from "@/hooks/api";
import Toast from "@/components/Toast";
import { SelectMembrosRede } from "@/components/Select/SelectMembrosRede";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParticipantesSection } from "@/components/conferencia/ParticipanteSection";

const nextId = () => Math.random().toString(36).substr(2, 9);

type TRede = { _id: string; name: string };

const PRIVILEGED_PERMISSIONS = ["ADMIN_CHURCH", "SUPERADMIN", "secretaria"];

export default function ConferenciaInscricaoNovo() {
  const navigate = useRouter();
  const { data: session } = useSession();
  const { churchid, conferenciaId } = navigate.query;

  const isPrivileged = session?.user?.permission?.some((p: string) =>
    PRIVILEGED_PERMISSIONS.includes(p)
  ) ?? false;

  const [participantes, setParticipantes] = useState<TParticipante[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [conferenciaInfo, setConferenciaInfo] = useState<any>(null);
  const [redes, setRedes] = useState<TRede[]>([]);
  const [selectedRede, setSelectedRede] = useState<TRede | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ _id: string; name: string } | null>(null);

  // Participantes
  const addParticipante = (data: TParticipante) => {
    setParticipantes((prev) => [
      ...prev,
      {
        _id: nextId(),
        nome: data.nome,
        telefone: data.telefone,
        isento: data.isento,
        sexo: data.sexo,
      },
    ]);
  };
  const editParticipante = (id: string, data: TParticipante) => {
    setParticipantes((prev) =>
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
  const removeParticipante = (id: string) => {
    setParticipantes((prev) => prev.filter((e) => e._id !== id));
  };
  const linkEquipe = (participanteId: string, equipeMembroId: string | undefined) => {
    setParticipantes((prev) =>
      prev.map((e) => (e._id === participanteId ? { ...e, equipeMembroId } : e)),
    );
  };

  const addMembroDaRede = () => {
    if (!selectedUser) return;
    setParticipantes((prev) => [
      ...prev,
      {
        _id: selectedUser._id,
        nome: selectedUser.name,
        telefone: "",
        isento: false,
        sexo: "",
        rede: isPrivileged ? selectedRede?._id : session?.user?.cem?._id,
      },
    ]);
    setSelectedUser(null);
  };

  // Pagamentos
  const addPagamento = (p: Omit<Pagamento, "_id" | "data">) => {
    setPagamentos((prev) => [...prev, { ...p, _id: nextId(), data: new Date().toISOString() }]);
  };

  const removeComprovante = async (id: string) => {
    const pagamento = pagamentos.find((p) => p._id === id);
    if (!pagamento) return;

    setPagamentos((prev) =>
      prev.map((p) =>
        p._id === id
          ? { ...p, comprovanteUrl: undefined, comprovanteName: undefined, comprovantePublicId: undefined }
          : p,
      ),
    );

    if (pagamento.comprovantePublicId || pagamento.comprovanteUrl) {
      try {
        await fetch(`/api/protected/churches/${churchid}/conferencia/comprovante/delete`, {
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
  };

  const removePagamento = async (id: string) => {
    const pagamento = pagamentos.find((p) => p._id === id);

    setPagamentos((prev) => prev.filter((p) => p._id !== id));

    if (pagamento?.comprovantePublicId || pagamento?.comprovanteUrl) {
      try {
        await fetch(`/api/protected/churches/${churchid}/conferencia/comprovante/delete`, {
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
  };

  const totalPago = useMemo(() => pagamentos.reduce((sum, p) => sum + p.valor, 0), [pagamentos]);

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

  useEffect(() => {
    const loadInscricaoData = async () => {
      if (!conferenciaId) {
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
          `/api/protected/churches/${churchid}/conferencia/inscricao?conferenciaId=${conferenciaId}&redeId=${redeId}`,
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const data = await response.json();

        if (data.participantes && Array.isArray(data.participantes)) {
          setParticipantes(data.participantes);
        }

        if (data.financeiro?.pagamento && Array.isArray(data.financeiro.pagamento)) {
          setPagamentos(data.financeiro.pagamento);
        }

        if (data.conferencia) {
          setConferenciaInfo(data.conferencia);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da inscrição:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadInscricaoData();
  }, [conferenciaId, churchid, selectedRede?._id, session?.user?.cem?._id, isPrivileged]);

  const handleSave = async () => {
    if (!conferenciaId) {
      Toast.showError("ID da conferência não encontrado");
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
        participantes,
        equipeMembers: [],
        rede: redeToSave,
        financeiro: {
          pagamento: pagamentos,
        },
      };

      const response = await useHttpPost({
        url: `/api/protected/churches/${churchid}/conferencia/inscricao?conferenciaId=${conferenciaId}`,
        data: payload,
      });

      if (response.result?.success) {
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
                Inscrição para Conferência
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {conferenciaInfo
                  ? conferenciaInfo.descricao
                  : "Gerenciamento de participantes e equipe"}
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
                  setParticipantes([]);
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
        <ResumoFinanceiroConferencia
          encontristas={participantes}
          equipeMembers={[]}
          pagamentos={pagamentos}
          totalPago={totalPago}
        />

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="flex items-end gap-2 p-4 bg-card/80 rounded-xl border border-border/50 backdrop-blur-sm">
              <SelectMembrosRede
                churchId={churchid as string}
                cemId={(isPrivileged ? selectedRede?._id : session?.user?.cem?._id) as string}
                title="Buscar membro"
                value={selectedUser?._id ?? ""}
                onChange={setSelectedUser}
                excludeIds={participantes.map(p => p._id)}
              />
              <Button onClick={addMembroDaRede} size="sm" className="gap-1 h-10 px-4" disabled={!selectedUser}>
                <Plus className="h-4 w-4" /> <span className="hidden sm:block">Adicionar</span>
              </Button>
            </div>

            <ParticipantesSection
              title={`Participantes (${participantes.length})`}
              emptyMessage="Nenhum participante adicionado"
              participantes={participantes}
              onAdd={addParticipante as any}
              onEdit={editParticipante as any}
              onRemove={removeParticipante}
              onLinkEquipe={linkEquipe}
            />
          </div>
        </div>

        <PagamentosSection
          pagamentos={pagamentos}
          onAdd={addPagamento}
          onRemove={removePagamento}
          onRemoveComprovante={removeComprovante}
          customFolder={conferenciaInfo?.numero ? `comprovantes/conferencia/${conferenciaInfo.numero}` : 'comprovantes/conferencia'}
        />
      </div>
    </div>
  );
}
