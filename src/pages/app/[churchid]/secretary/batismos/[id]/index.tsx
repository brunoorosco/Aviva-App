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
import { SupervisorSelect } from "@/components/Select/SelectSupervisores";
import { useForm, Controller } from "react-hook-form";
import * as XLSX from "xlsx";

function formatDate(dateValue: any) {
  if (!dateValue) return "";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
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

  // Sheet 1 — Todos (ordem alfabética)
  const todos = [...batismo.batizandos]
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(toRow);

  // Sheet 2 — Somente homens
  const homens = [...batismo.batizandos]
    .filter((p) => p.sexo === "M")
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(toRow);

  // Sheet 3 — Somente mulheres
  const mulheres = [...batismo.batizandos]
    .filter((p) => p.sexo === "F")
    .sort((a, b) => a.nome.localeCompare(b.nome))
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

  if (!batismo) return <p className="p-10 text-center">Batismo não encontrado.</p>;

  const isAdmin = !!session?.user?.permission?.includes("admin");
  const userRede = session?.user?.cem?.name;

  const getDateOnly = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const baptismDate = new Date(batismo.data);
  const dataString = batismo.data as unknown as string;
  if (typeof dataString === "string" && dataString.length <= 10) {
    baptismDate.setHours(12, 0, 0, 0);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFutureOrAdmin = getDateOnly(baptismDate) >= today.getTime() || isAdmin;
  const canAdd = isFutureOrAdmin;

  const dataFormatada = formatDate(batismo.data);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { nome: "", sexo: "", rede: "" },
  });

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
      const payload = {
        nome: data.nome.toUpperCase(),
        sexo: data.sexo,
        rede: isAdmin ? data.rede.split("|")[1] : userRede,
      };

      await axios.post(`/api/protected/churches/${churchid}/batismo/${batismo._id}`, payload);
      Toast.showSuccess("Batizando adicionado!");

      setBatismo({
        ...batismo,
        batizandos: [
          ...batismo.batizandos,
          { nome: payload.nome, rede: payload.rede, sexo: payload.sexo, isCourse: false },
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

  const removeCandidate = async (nome: string, rede: string) => {
    if (!confirm(`Deseja remover ${nome}?`)) return;
    try {
      setIsLoading(true);
      await axios.delete(`/api/protected/churches/${churchid}/batismo/${batismo._id}`, {
        data: { nome, rede },
      });

      Toast.showSuccess("Batizando removido!");
      setBatismo({
        ...batismo,
        batizandos: batismo.batizandos.filter((p) => !(p.nome === nome && p.rede === rede)),
      });
    } catch (error) {
      console.error(error);
      Toast.showError("Erro ao remover batizando.");
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
                <SupervisorSelect control={control} name="rede" title="Selecione a Rede" />
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
              <span className="sm:hidden">Lista</span>
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
                        onClick={() => removeCandidate(pessoa.nome, pessoa.rede || "")}
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