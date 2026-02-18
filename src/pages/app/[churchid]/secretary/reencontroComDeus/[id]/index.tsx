import { TReencontroComDeus } from "@/domain/models/encontroComDeus";
import { getReencontroComDeusByIdService } from "@/services/reencontroComDeus";
import { GetServerSideProps } from "next/types";
import {
  Calendar,
  Users,
  Church,
  Network,
  Phone,
  User,
  MapPin,
  Cake,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import router from "next/router";
import { getRedeName } from "@/utils/helpersNameREde";

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
  reencontro: TReencontroComDeus | null;
};

export default function ReencontroPage({ reencontro }: Props) {
  if (!reencontro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Reencontro não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            O reencontro solicitado não existe ou foi removido.
          </p>
          <Link
            href="/reencontros"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar aos Reencontros
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Título principal */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Reencontro #{reencontro.numero}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm sm:text-base">{formatDate(reencontro.data)}</span>
                </div>
              </div>

              <Button onClick={() => router.back()} className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reencontro.igreja && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Church className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Igreja</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {reencontro.igreja}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reencontristas</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {reencontro.reencontristas?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Lista de Reencontristas */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Lista de Reencontristas
              </h2>
            </div>

            <div className="p-6">
              {!reencontro.reencontristas || reencontro.reencontristas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Nenhum reencontrista cadastrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ainda não há participantes registrados neste reencontro.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {reencontro.reencontristas.map((pessoa, index) => (
                    <article
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-shadow"
                    >
                      {/* Header do card */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {pessoa.nome || "Nome não informado"}
                            </h3>
                            {pessoa.idade && (
                              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                <Cake className="w-3 h-3" />
                                <span>{formatAge(Number(pessoa.idade))}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Badge de número */}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 self-start">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Informações */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        {pessoa.telefone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {pessoa.telefone}
                            </span>
                          </div>
                        )}

                        {pessoa.igreja && (
                          <div className="flex items-center gap-2">
                            <Church className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {pessoa.igreja}
                            </span>
                          </div>
                        )}

                        {pessoa.rede && (
                          <div className="flex items-center gap-2">
                            <Network className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {getRedeName(pessoa.rede)}
                            </span>
                          </div>
                        )}

                        {pessoa.endereco && (
                          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {pessoa.endereco}
                            </span>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
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
      return { props: { reencontro: null } };
    }

    const encontro = await getReencontroComDeusByIdService(churchid, id);

    if (!encontro) {
      return { props: { reencontro: null } };
    }

    return {
      props: {
        reencontro: {
          ...encontro,
          _id: encontro._id.toString(),
          data: encontro.data.toISOString(),
          reencontristas: encontro.reencontristas || [],
        },
      },
    };
  } catch (error) {
    console.error("Erro ao carregar reencontro:", error);
    return { props: { reencontro: null } };
  }
};
