import { Button } from "@/components/ui/button";
import { baptism } from "@/domain/models/baptism";
import { getBatismoByIdService } from "@/services/batismos";
import { capitalizeWords } from "@/utils/capitalizaFirst";
import { ArrowLeft, PrinterIcon, Trash2, UserPlus, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Toast from "@/components/Toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import * as XLSX from "xlsx";
import { gerarCertificados } from "@/lib/pdf";
import { useHttpGet } from "@/hooks/api";
import SelectBatizando from "@/components/batismo/SelectBatizando";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

function formatDate(dateValue: any) {
  if (!dateValue) return "";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

// Exibe a data do batismo (data_batismo) como dd/mm/yyyy no fuso UTC-3.
function formatDataBatismo(dateValue: any) {
  if (!dateValue) return "";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

// Converte a data do evento para 00:00 no fuso UTC-3 (America/Sao_Paulo),
// garantindo que data_batismo exibida como dd/mm/yyyy não desloque o dia.
function buildDataBatismo(data: any): Date {
  const date = data instanceof Date ? data : new Date(data);
  if (!(date instanceof Date) || isNaN(date.getTime())) return new Date();
  const y = date.getUTCFullYear() || 1970;
  const m = date.getUTCMonth() || 0;
  const d = date.getUTCDate() || 1;
  return new Date(Date.UTC(y, m, d, 3));
}

type Props = {
  batismo: baptism | null;
};
// ─── Função de exportação ────────────────────────────────────────────────────
function exportarListaExcel(batismo: baptism, dataFormatada: string) {
  const wb = XLSX.utils.book_new();

  const toRow = (p: any, i: number) => ({
    "#": i + 1,
    Nome: capitalizeWords(p.nome),
    Rede: p.rede || "-",
    Sexo: p.sexo === "M" ? "Masculino" : p.sexo === "F" ? "Feminino" : "-",
  });

  const sortByName = (a: any, b: any) => a.nome.localeCompare(b.nome, "pt-BR");

  // Sheet 1 — Todos (ordem alfabética)
  const todos = [...batismo.batizandos]
    .sort(sortByName)
    .map(toRow);

  // Sheet 2 — Somente homens
  const homens = [...batismo.batizandos]
    .filter((p) => p.sexo === "M")
    .sort(sortByName)
    .map(toRow);

  // Sheet 3 — Somente mulheres
  const mulheres = [...batismo.batizandos]
    .filter((p) => p.sexo === "F")
    .sort(sortByName)
    .map(toRow);

  const addSheet = (data: any[], sheetName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);

    // Larguras de coluna
    ws["!cols"] = [
      { wch: 5 },   // #
      { wch: 35 },  // Nome
      { wch: 20 },  // Rede
      { wch: 12 },  // Sexo
    ];

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  };

  addSheet(todos, "Todos");
  addSheet(homens, "Homens");
  addSheet(mulheres, "Mulheres");

  const fileName = `batismo_${dataFormatada.replace(/\//g, "-")}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
// ─────────────────────────────────────────────────────────────────────────────

export default function BatismoPage({ batismo: initialBatismo }: Props) {
  const router = useRouter();
  const { churchid } = useParams();
  const { data: session } = useSession();
  const [batismo, setBatismo] = useState(initialBatismo);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [candidateToRemove, setCandidateToRemove] = useState<{
    nome: string;
    rede: string;
    userId?: string;
  } | null>(null);

  if (!batismo) return <p className="p-10 text-center">Batismo não encontrado.</p>;

  const isAdmin =
    ["bispo", "admin"].includes(session?.user?.role?.toLowerCase() || "") ||
    session?.user?.permission?.some((p) => p.toLowerCase() === "admin") ||
    false;
  const userRede = session?.user?.cem?.name;

  const baptismDateISO = new Date(batismo.data).toISOString().slice(0, 10);
  const todayISO = new Date().toISOString().slice(0, 10);

  const isFutureOrAdmin = baptismDateISO >= todayISO || isAdmin;
  const canAdd = isFutureOrAdmin;

  const dataFormatada = formatDate(batismo.data);

  const { control, handleSubmit, reset, register, watch, setValue } = useForm({
    defaultValues: { nome: "", sexo: "", rede: "", userId: "" },
  });

  const userCem = session?.user?.cem;
  const watchedRede: string = watch("rede") || "";
  const watchedUserId: string = watch("userId") || "";
  const targetRedeId = isAdmin
    ? watchedRede.split("|")[0]
    : userCem?._id || "sem-rede";
  const targetRedeName = isAdmin
    ? watchedRede.split("|")[1]
    : userCem?.name || "";
  const isSemRede =
    targetRedeId === "sem-rede" || /sem.?rede/i.test(targetRedeName);

  const { data: redesData } = useHttpGet<any>(
    `/api/protected/churches/${churchid}/redes`
  );
  const rawRedes = redesData?.data;
  const redeOptions = Array.isArray(rawRedes)
    ? rawRedes
    : Array.isArray(rawRedes?.data)
      ? rawRedes.data
      : [];

  const onSelectBatizando = (member: {
    _id: string;
    name: string;
    sexo?: string;
  }) => {
    setValue("userId", member._id);
    setValue("nome", member.name);
    if (member.sexo) setValue("sexo", member.sexo);
  };

  const handleRedeChange = (value: string) => {
    setValue("rede", value);
    setValue("userId", "");
    setValue("nome", "");
    setValue("sexo", "");
  };

  async function exportPdf(batismo: baptism, dataFormatada: string) {
    const resp = await fetch(
      `/api/protected/churches/${churchid}/batismo/list-pdf`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batizandos: batismo.batizandos,
          data: batismo.data,
        }),
      }
    );

    if (!resp.ok) {
      // Loga o status e o body do erro para diagnóstico
      const errorText = await resp.text();
      console.error("PDF error →", resp.status, errorText);
      throw new Error(`Erro ao gerar PDF: ${resp.status} - ${errorText}`);
    }

    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lista-batismo-${dataFormatada.replace(/\//g, "-")}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const onAddCandidate = async (data: any) => {
    try {
      setIsLoading(true);
      const payload: any = {
        nome: data.nome.toUpperCase(),
        sexo: data.sexo,
        rede: isAdmin ? data.rede.split("|")[1] : userRede,
      };
      if (data.userId) payload.userId = data.userId;

      await axios.post(`/api/protected/churches/${churchid}/batismo/${batismo._id}`, payload);
      Toast.showSuccess("Batizando adicionado!");

      setBatismo({
        ...batismo,
        batizandos: [
          ...batismo.batizandos,
          {
            nome: payload.nome,
            rede: payload.rede,
            sexo: payload.sexo,
            isCourse: false,
            userId: payload.userId,
          },
        ].sort((a, b) => a.nome.localeCompare(b.nome)),
      });

      setIsAdding(false);
      reset();
    } catch (error) {
      console.error(error);
      Toast.showError("Erro ao adicionar batizando.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeCandidate = async (nome: string, rede: string, userId?: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/protected/churches/${churchid}/batismo/${batismo._id}`, {
        data: { nome, rede, ...(userId ? { userId } : {}) },
      });

      Toast.showSuccess("Batizando removido!");
      setBatismo({
        ...batismo,
        batizandos: batismo.batizandos.filter((p) => !(p.nome === nome && p.rede === rede)),
      });
      setCandidateToRemove(null);
    } catch (error) {
      console.error(error);
      Toast.showError("Erro ao remover batizando.");
      setCandidateToRemove(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sm:p-6 mt-10 max-w-4xl mx-auto pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Batismo</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">{dataFormatada}</span>
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
              {batismo.batizandos.length} batizandos
            </span>
            {batismo.local && (
              <span className="text-muted-foreground">
                📍 {Array.isArray(batismo.local) ? batismo.local.join(", ") : batismo.local}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          {canAdd && (
            <Button
              onClick={() => setIsAdding(!isAdding)}
              variant={isAdding ? "outline" : "default"}
              className={`flex items-center gap-2 w-full sm:w-auto justify-center ${!isAdding ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" : ""
                }`}
            >
              {isAdding ? (
                "Cancelar Inscrição"
              ) : (
                <>
                  <UserPlus size={18} /> Adicionar Batizando
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
            Voltar
          </Button>
        </div>
      </div>

      {/* FORM ADICIONAR */}
      {isAdding && (
        <div className="bg-white dark:bg-dark-secondary p-6 rounded-xl border shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-medium mb-4">Novo Batizando</h3>
          <form
            onSubmit={handleSubmit(onAddCandidate)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
          >
            {isSemRede ? (
              <div className="flex flex-col gap-1.5">
                <Label>Nome Completo</Label>
                <Controller
                  name="nome"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input {...field} placeholder="NOME DO BATIZANDO" className="uppercase" />
                  )}
                />
              </div>
            ) : isAdmin && !watchedRede ? (
              <div className="flex flex-col gap-1.5">
                <Label>Nome Completo</Label>
                <div className="flex items-center px-3 h-10 rounded-md border bg-muted/50 text-sm text-muted-foreground">
                  Selecione a rede primeiro
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label>Nome Completo</Label>
                <SelectBatizando
                  churchId={churchid as string}
                  redeId={targetRedeId}
                  value={watchedUserId || undefined}
                  excludeIds={batismo.batizandos
                    .map((b: any) => b.userId)
                    .filter(Boolean)}
                  onChange={onSelectBatizando}
                />
              </div>
            )}

            <input type="hidden" {...register("userId")} />

            <div className="flex flex-col gap-1.5">
              <Label>Sexo</Label>
              <Controller
                name="sexo"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {isAdmin ? (
              <div className="flex flex-col gap-1.5 text-black">
                <Label>Rede</Label>
                <Select value={watchedRede} onValueChange={handleRedeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a Rede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="sem-rede" value="sem-rede|CEM Padrão (Sem Rede)">
                      CEM Padrão (Sem Rede)
                    </SelectItem>
                    {redeOptions.map((redeItem: any) => (
                      <SelectItem
                        key={redeItem._id}
                        value={`${redeItem._id}|${redeItem.name}`}
                      >
                        {redeItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label>Rede</Label>
                <Input value={userRede || ""} disabled className="bg-muted" />
              </div>
            )}

            <div className="sm:col-span-3 flex justify-end mt-2">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Salvando..." : "Confirmar Inscrição"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* LISTA */}
      <div className="bg-gray-50 dark:bg-background px-2 py-4 rounded-xl shadow-sm border">
        {/* Cabeçalho da lista com botão de exportar */}
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-semibold">Batizandos Confirmados</h2>

          {isAdmin && batismo.batizandos.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportPdf(batismo, dataFormatada)}
              className="flex items-center gap-2 text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar Lista</span>
              {/* <span className="hidden sm:inline">Exportar Excel</span> */}
            </Button>
          )}

          {isAdmin && batismo.batizandos.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => gerarCertificados(churchid as string, batismo)}
              className="flex items-center gap-2 text-blue-700 border-blue-300 hover:bg-blue-50 hover:text-blue-800"
            >
              <PrinterIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Certificados (PDF)</span>
              <span className="sm:hidden">Certificados</span>
            </Button>
          )}
        </div>

        {batismo.batizandos.length === 0 ? (
          <p className="text-sm text-center py-10 text-gray-500">
            Nenhum batizando cadastrado até o momento.
          </p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3 p-2">
            {batismo.batizandos.map((pessoa, index) => {
              const canDelete = isAdmin || (!!userRede && pessoa.rede === userRede);

              return (
                <li
                  key={index}
                  className="bg-white dark:bg-dark-secondary border rounded-lg px-4 py-3 flex items-center justify-between hover:shadow-md transition group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {index + 1}. {capitalizeWords(pessoa.nome)}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      {pessoa.rede && <span>Rede: {pessoa.rede}</span>}
                      {pessoa.sexo && (
                        <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">
                          {pessoa.sexo === "M" ? "Masculino" : "Feminino"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <Link
                        download
                        target="_blank"
                        href={{
                          pathname: `/api/protected/churches/${churchid}/baptism/certificado-pdf`,
                          query: {
                            nome: capitalizeWords(pessoa.nome),
                            data: dataFormatada,
                          },
                        }}
                        className="text-primary hover:opacity-80 p-2 rounded-full hover:bg-primary/10 transition"
                        title="Imprimir Certificado"
                      >
                        <PrinterIcon className="w-4 h-4" />
                      </Link>
                    )}

                    {canDelete && (
                      <button
                        onClick={() =>
                          setCandidateToRemove({
                            nome: pessoa.nome,
                            rede: pessoa.rede || "",
                            userId: pessoa.userId,
                          })
                        }
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                        title="Remover Batizando"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={!!candidateToRemove}
        onClose={() => setCandidateToRemove(null)}
        onConfirm={() =>
          candidateToRemove &&
          removeCandidate(candidateToRemove.nome, candidateToRemove.rede, candidateToRemove.userId)
        }
        title="Remover Batizando"
        description={`Deseja remover ${candidateToRemove?.nome ? capitalizeWords(candidateToRemove.nome) : ""}? O membro deixará de constar como batizado.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        isLoading={isLoading}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string;
  const churchid = ctx.params?.churchid as string;
  const batismo = await getBatismoByIdService(churchid, id);

  if (!batismo) return { props: { batismo: null } };

  return {
    props: {
      batismo: {
        ...batismo,
        _id: batismo._id.toString(),
        data: batismo?.data?.toString(),
        batizandos: batismo.batizandos || [],
      },
    },
  };
};