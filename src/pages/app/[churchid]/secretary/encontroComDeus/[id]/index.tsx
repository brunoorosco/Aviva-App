import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { TEncontroComDeus } from "@/domain/models/encontroComDeus";
import { getEncontroComDeusByIdService } from "@/services/encontroComDeus";
import { capitalizeWords } from "@/utils/capitalizaFirst";
import { getRedeName } from "@/utils/helpersNameREde";
import { ArrowLeft, Calendar, Users, Church, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";

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

function formatAge(age?: number): string {
  if (!age) return "";
  return `${age} anos`;
}

type Props = {
  encontro: TEncontroComDeus | null;
};

export default function EncontroPage({ encontro }: Props) {
  const router = useRouter();

  if (!encontro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Encontro não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            O encontro solicitado não existe ou foi removido.
          </p>
          <Button onClick={() => router.back()} className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const encontristas = encontro.encontristas ?? [];
  const equipe = encontro.equipe ?? [];
  const defaultTab = encontristas.length > 0 ? "encontristas" : "equipe";

  const getAgeDisplay = (idade?: string, dataNascimento?: string) => {
    if (idade) {
      const parsed = Number(idade);
      if (!Number.isNaN(parsed) && parsed > 0) {
        const labeled = formatAge(parsed);
        return labeled || `${parsed} anos`;
      }
      return idade;
    }

    if (dataNascimento) {
      const date = new Date(dataNascimento);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("pt-BR");
      }
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

  const renderEncontristasTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800/60 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Rede</th>
            <th className="px-4 py-3">Telefone</th>
            <th className="px-4 py-3 hidden md:table-cell">Igreja</th>
            <th className="px-4 py-3 hidden lg:table-cell">Idade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
          {encontristas.map((pessoa, index) => {
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
                      <span>#{index + 1}</span>
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
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                  {pessoa.igreja || "—"}
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

  const renderEquipeTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800/60 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Rede</th>
            <th className="px-4 py-3">Isento</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
          {equipe.map((membro, index) => {
            const redeName = getRedeName(membro.rede);

            return (
              <tr key={membro._id ?? `${membro.name}-${index}`}>
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {capitalizeWords(membro.name) || "Nome não informado"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {redeName || "—"}
                </td>
                <td className="px-4 py-3">
                  {membro.isento ? (
                    <Badge
                      variant="secondary"
                      className="border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                    >
                      Sim
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="border border-gray-300 bg-gray-200 text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-200"
                    >
                      Não
                    </Badge>
                  )}
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
        {/* Header */}
        <header className="mb-6">
          <div className="bg-white dark:bg-black/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Botão Voltar Mobile */}
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

            {/* Header Desktop */}
            <div className="hidden sm:flex sm:items-start sm:justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {encontro.numero ? `Encontro #${encontro.numero}` : "Encontro com Deus"}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(encontro.data)}</span>
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

            {/* Título Mobile */}
            <div className="sm:hidden mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {encontro.numero ? `Encontro #${encontro.numero}` : "Encontro com Deus"}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(encontro.data)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {encontro.igreja && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Church className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Igreja</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {encontro.igreja}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Encontristas</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {encontristas.length}
                  </p>
                </div>
              </div>

              {encontro.numero && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Hash className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Número</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {encontro.numero}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Participantes */}
        <section>
          <div className="bg-white dark:bg-black/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Participantes
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Visualize encontristas e equipe de forma organizada.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-4">
                  <span>
                    Encontristas:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {encontristas.length}
                    </span>
                  </span>
                  <span>
                    Equipe:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {equipe.length}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full max-w-lg grid-cols-2 bg-gray-100 dark:bg-gray-800/60">
                  <TabsTrigger value="encontristas" className="flex items-center gap-2">
                    Encontristas
                    <span className="flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      {encontristas.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="equipe" className="flex items-center gap-2">
                    Equipe
                    <span className="flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      {equipe.length}
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="encontristas" className="mt-4">
                  {encontristas.length === 0
                    ? renderEmptyState(
                        "Nenhum encontrista cadastrado",
                        "Ainda não há participantes registrados neste encontro."
                      )
                    : renderEncontristasTable()}
                </TabsContent>

                <TabsContent value="equipe" className="mt-4">
                  {equipe.length === 0
                    ? renderEmptyState(
                        "Nenhuma equipe cadastrada",
                        "Cadastre os membros da equipe para acompanhar o encontro."
                      )
                    : renderEquipeTable()}
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
      return { props: { encontro: null } };
    }

    const encontro = await getEncontroComDeusByIdService(churchid, id);

    if (!encontro) {
      return { props: { encontro: null } };
    }

    return {
      props: {
        encontro: {
          ...encontro,
          _id: encontro._id?.toString() || null,
          data: encontro.data?.toISOString() || null,
          updatedAt: encontro.updatedAt?.toISOString() || null,

          // ✅ Remove _id se for undefined
          encontristas: (encontro.encontristas || []).map((e: any) => {
            const { _id, ...rest } = e;
            return {
              ...rest,
              ...(e._id ? { _id: e._id.toString() } : {}), // só adiciona se existir
            };
          }),

          equipe: (encontro.equipe || []).map((m: any) => {
            const { _id, ...rest } = m;
            return {
              ...rest,
              ...(m._id ? { _id: m._id.toString() } : {}),
            };
          }),

          financeiro: (encontro.financeiro || []).map((f: any) => ({
            ...f,
            _id: f._id?.toString() || null,
            createdAt: f.createdAt instanceof Date ? f.createdAt.toISOString() : f.createdAt,
            updatedAt: f.updatedAt instanceof Date ? f.updatedAt.toISOString() : f.updatedAt,
            pagamento: (f.pagamento || []).map((p: any) => ({
              ...p,
              _id: p._id?.toString() || null,
              data: p.data instanceof Date ? p.data.toISOString() : p.data,
            })),
          })),
        },
      },
    };
  } catch (error) {
    console.error("Erro ao carregar encontro:", error);
    return { props: { encontro: null } };
  }
};
