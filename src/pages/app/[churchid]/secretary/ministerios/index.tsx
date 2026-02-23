"use client";

import Link from "next/link";
import Toast from "@/components/Toast";
import ButtonNew from "@/components/ButtonSubmit/buttonAdd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { Pencil, Users, Network, Loader2, Trash } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { TMinisterios } from "@/domain/models/churchs";

const Cem = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const churchId = router.query?.churchid;
  const { isAdmin } = usePermissions();
  const { data: cems, mutate } = useHttpGet<TMinisterios[]>(
    `/api/protected/churches/${session?.user.churchId}/ministerios`,
  );
  const userCem = session?.user.cem._id;

  const handleDelete = async (id: string) => {
    Toast.showDelete(`/api/protected/churches/${session?.user.churchId}/ministerios/${id}`);
    await mutate();
  };

  const goToMembers = (cemId: string) => {
    router.push(`/app/${churchId}/secretary/ministerios/${cemId}`);
  };

  const isUserCem = (cemId: string) => cemId === userCem;
  const canViewCem = (cemId: string) => isAdmin || isUserCem(cemId);

  const getMembrosTotal = (ministerio: TMinisterios) => {
    const lideres = ministerio?.lideres?.length ?? 0;
    const membros = ministerio?.membros?.length ?? 0;
    return lideres + membros;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-gray-500">Carregando Ministérios...</p>
              </div>
            </div>
          }
        >
          {/* Cabeçalho */}
          <div className="my-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 dark:bg-dark-secondary rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-orange-900/30 rounded-xl">
                  <Network className="w-6 h-6 text-blue-600 dark:text-orange-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Nossos Ministérios
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {cems?.data?.length || 0}{" "}
                    {cems?.data?.length === 1 ? "ministério" : "ministérios"} cadastradas
                  </p>
                </div>
              </div>

              {isAdmin && (
                <Link
                  href={`../../${churchId}/secretary/ministerios/new`}
                  className="w-full sm:w-auto"
                >
                  <ButtonNew />
                </Link>
              )}
            </div>
          </div>

          {/* Grid de Cards */}
          {!cems?.data || cems.data.length === 0 ? (
            <div className="bg-gray-100 dark:bg-dark-secondary rounded-2xl shadow-sm p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-full">
                  <Network className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhum ministério cadastrado
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {isAdmin
                      ? "Clique no botão acima para criar o primeiro ministério"
                      : "Aguarde até que um rede ministério seja criado"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {cems.data.map((cem: TMinisterios) => {
                const isActive = canViewCem(cem._id);
                const isCurrentUserCem = isUserCem(cem._id);

                return (
                  <div key={cem._id} className="group relative">
                    {/* Botão de Edição */}
                    {isAdmin && (
                      <Link
                        href={`../../${churchId}/secretary/ministerios/${cem._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 z-10 p-2 bg-gray-100 dark:bg-dark-secondary 
                                 rounded-full shadow-md hover:bg-gray-10 dark:hover:bg-gray-700"
                      >
                        <Trash className="w-4 h-4 text-red-600 dark:text-red-500" />
                      </Link>
                    )}

                    {/* Card da Rede */}
                    <Card
                      className={`
                        relative overflow-hidden rounded-2xl shadow-md 
                        hover:shadow-xl transition-all duration-300 cursor-pointer
                        border-2 h-full
                        ${
                          isCurrentUserCem
                            ? "dark:border-orange-500 border-blue-500 from-blue-50"
                            : isActive
                              ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-secondary hover:border-blue-300 dark:hover:border-orange-300"
                              : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-secondary/50"
                        }
                        ${isActive ? "hover:-translate-y-1" : ""}
                      `}
                      onClick={() => goToMembers(cem._id)}
                    >
                      {/* Badge Minha Rede */}
                      {isCurrentUserCem && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-orange-500 text-white text-xs px-2 py-1">
                            Meu Ministério
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pt-12 pb-4">
                        <div className="flex flex-col items-center text-center space-y-2">
                          {/* Ícone da Rede */}
                          <div
                            className={`
                            p-3 rounded-full mb-2
                            ${
                              isCurrentUserCem
                                ? "bg-blue-100 dark:bg-blue-900/40"
                                : "bg-gray-100 dark:bg-gray-700"
                            }
                          `}
                          >
                            <Users
                              className={`
                              w-6 h-6
                              ${
                                isCurrentUserCem
                                  ? "text-blue-600 dark:text-orange-600 "
                                  : isActive
                                    ? "text-gray-700 dark:text-gray-300"
                                    : "text-gray-400"
                              }
                            `}
                            />
                          </div>

                          {/* Nome da Rede */}
                          <CardTitle
                            className={`
                            text-lg sm:text-xl font-bold
                            ${
                              isActive
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-400 dark:text-gray-600"
                            }
                          `}
                          >
                            {cem.name}
                          </CardTitle>

                          {/* Descrição */}
                          {cem.description && (
                            <p
                              className={`
                              text-xs sm:text-sm line-clamp-2 px-2
                              ${
                                isActive
                                  ? "text-gray-600 dark:text-gray-400"
                                  : "text-gray-400 dark:text-gray-600"
                              }
                            `}
                            >
                              {cem.description}
                            </p>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 pb-6">
                        {/* Contador de Membros */}
                        <div
                          className={`
                          flex items-center justify-center gap-2 p-4 rounded-xl
                          ${
                            isCurrentUserCem
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-gray-100 dark:bg-gray-700/50"
                          }
                        `}
                        >
                          <Users
                            className={`
                            w-5 h-5
                            ${
                              isCurrentUserCem
                                ? "text-blue-600 dark:text-orange-500"
                                : isActive
                                  ? "text-gray-700 dark:text-gray-300"
                                  : "text-gray-400"
                            }
                          `}
                          />
                          <div className="flex items-baseline gap-1">
                            <span
                              className={`
                              text-2xl font-bold
                              ${
                                isCurrentUserCem
                                  ? "text-blue-600 dark:text-orange-500"
                                  : isActive
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-400"
                              }
                            `}
                            >
                              {
                                <span>
                                  {getMembrosTotal(cem)}
                                </span>
                              }
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      {/* Indicador visual de hover */}
                      {isActive && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      )}
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Cem;
