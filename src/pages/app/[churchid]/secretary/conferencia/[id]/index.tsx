import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TConferencia } from "@/domain/models/conferencia";
import { getConferenciaByIdService } from "@/services/conferencia";
import { capitalizeWords } from "@/utils/capitalizaFirst";
import { getRedeName } from "@/utils/helpersNameREde";
import { ArrowLeft, Calendar, Users, MapPin, Hash, Search, FilterX } from "lucide-react";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useMemo, useState } from "react";

function formatDate(dateValue: any): string {
  if (!dateValue) return "Data não informada";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "Data inválida";

  return date.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  conferencia: TConferencia | null;
};

export default function ConferenciaPage({ conferencia }: Props) {
  const router = useRouter();

  if (!conferencia) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Conferência não encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            A conferência solicitada não existe ou foi removida.
          </p>
          <Button onClick={() => router.back()} className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  function calculateAgeFromBirthDate(dataNascimento: string): string {
    const birth = new Date(dataNascimento);
    if (isNaN(birth.getTime())) return "—";

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age > 0 ? `${age} anos` : "—";
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRede, setSelectedRede] = useState("all");

  const redesDisponiveis = useMemo(() => {
    const redesSet = new Set<string>();

    conferencia.participantes?.forEach((p) => {
      const name = getRedeName(p.rede);
      if (name) redesSet.add(name);
    });

    conferencia.equipe?.forEach((m) => {
      const name = getRedeName(m.rede);
      if (name) redesSet.add(name);
    });

    return Array.from(redesSet).sort();
  }, [conferencia]);

  const participantesFiltrados = useMemo(() => {
    let list = [...(conferencia.participantes ?? [])];

    if (selectedRede !== "all") {
      list = list.filter((p) => getRedeName(p.rede) === selectedRede);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      list = list.filter((p) => p.nome.toLowerCase().includes(search));
    }

    return list.sort((a, b) =>
      (a.nome || "").localeCompare(b.nome || "", "pt-BR", { sensitivity: "base" })
    );
  }, [conferencia.participantes, selectedRede, searchTerm]);

  const defaultTab = "participantes";

  const getAgeDisplay = (idade?: string, dataNascimento?: string) => {
    if (idade) {
      const parsed = Number(idade);
      if (!Number.isNaN(parsed) && parsed > 0) {
        return `${parsed} anos`;
      }
      return idade;
    }

    if (dataNascimento) {
      return calculateAgeFromBirthDate(dataNascimento);
    }

    return "—";
  };

  const renderEmptyState = (title: string, description: string) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );

  const renderParticipantesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800/60 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Rede</th>
            <th className="px-4 py-3">Telefone</th>
            <th className="px-4 py-3 hidden lg:table-cell">Idade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
          {participantesFiltrados.map((pessoa, index) => {
            const redeName = getRedeName(pessoa.rede);
            const ageLabel = getAgeDisplay(pessoa.idade, pessoa.dataNascimento);

            return (
              <tr key={pessoa._id ?? `${capitalizeWords(pessoa.nome)}-${index}`}>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {capitalizeWords(pessoa.nome) || "Nome não informado"}
                    </span>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {pessoa.isento && (
                        <Badge
                          variant="secondary"
                          className="border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                        >
                          Isento
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {redeName || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {pessoa.telefone || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                  {ageLabel}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-secondary">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <div className="bg-white dark:bg-black/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start mb-4 sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>

            <div className="hidden sm:flex sm:items-start sm:justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {conferencia.descricao || "Conferência"}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(conferencia.data)}</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>

            <div className="sm:hidden mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {conferencia.descricao || "Conferência"}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(conferencia.data)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {conferencia.local && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Local</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {conferencia.local}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Participantes</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {conferencia.participantes?.length || 0}
                  </p>
                </div>
              </div>

              {conferencia.numero && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Hash className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Edição/Nº</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {conferencia.numero}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mb-6 bg-white dark:bg-black/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                Buscar por nome
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Nome do participante ou equipe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="w-full md:w-64">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                Filtrar por Rede
              </label>
              <Select value={selectedRede} onValueChange={setSelectedRede}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma rede" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Redes</SelectItem>
                  {redesDisponiveis.map((rede) => (
                    <SelectItem key={rede} value={rede}>
                      {rede}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || selectedRede !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRede("all");
                }}
                className="text-gray-500 hover:text-red-500 gap-2 h-9"
              >
                <FilterX className="w-4 h-4" />
                <span className="hidden sm:inline">Limpar</span>
              </Button>
            )}
          </div>
        </div>

        <section>
          <div className="bg-white dark:bg-black/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Inscritos
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Visualize os participantes de forma organizada.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-4">
                  <span>
                    Total:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {participantesFiltrados.length}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full max-w-[200px] grid-cols-1 bg-gray-100 dark:bg-gray-800/60">
                  <TabsTrigger value="participantes" className="flex items-center gap-2">
                    Participantes
                    <span className="flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      {participantesFiltrados.length}
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="participantes" className="mt-4">
                  {participantesFiltrados.length === 0
                    ? renderEmptyState(
                        "Nenhum participante encontrado",
                        "Não há resultados para os filtros aplicados."
                      )
                    : renderParticipantesTable()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const id = ctx.params?.id as string;
    const churchid = ctx.params?.churchid as string;

    if (!id || !churchid) {
      return { props: { conferencia: null } };
    }

    const conferencia = await getConferenciaByIdService(churchid, id);

    if (!conferencia) {
      return { props: { conferencia: null } };
    }

    return {
      props: {
        conferencia: {
          ...conferencia,
          _id: conferencia._id?.toString() || null,
          data: conferencia.data?.toISOString() || null,
          updatedAt: conferencia.updatedAt?.toISOString() || null,
          createdAt: conferencia.createdAt?.toISOString() || null,

          participantes: (conferencia.participantes || []).map((p: any) => {
            const { _id, ...rest } = p;
            return {
              ...rest,
              ...(p._id ? { _id: p._id.toString() } : {}),
            };
          }),

          equipe: (conferencia.equipe || []).map((m: any) => {
            const { _id, ...rest } = m;
            return {
              ...rest,
              ...(m._id ? { _id: m._id.toString() } : {}),
            };
          }),

          financeiro: (conferencia.financeiro || []).map((f: any) => ({
            ...f,
            _id: f._id?.toString() || null,
            createdAt: f.createdAt instanceof Date ? f.createdAt.toISOString() : f.createdAt,
            updatedAt: f.updatedAt instanceof Date ? f.updatedAt.toISOString() : f.updatedAt,
            pagamento: (f.pagamento || []).map((pag: any) => ({
              ...pag,
              _id: pag._id?.toString() || null,
              data: pag.data instanceof Date ? pag.data.toISOString() : pag.data,
            })),
          })),
        },
      },
    };
  } catch (error) {
    console.error("Erro ao carregar conferência:", error);
    return { props: { conferencia: null } };
  }
};
