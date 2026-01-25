"use client";

import Link from "next/link";
import Toast from "@/components/Toast";
import ButtonNew from "@/components/ButtonSubmit/buttonAdd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CellsModel } from "@/domain/models/cells";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { Pencil, Users, Network, Loader2 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

const Cem = () => {
  const router = useRouter();
  const churchId = router.query?.churchid;
  const { data: session } = useSession();
  const { isAdmin } = usePermissions();
  const { data: cems, mutate } = useHttpGet<CellsModel[]>(
    `/api/protected/churches/${session?.user.churchId}/cems`,
  );
  const userCem = session?.user.cem._id;

  const handleDelete = async (id: string) => {
    Toast.showDelete(`/api/protected/churches/${session?.user.churchId}/cems/${id}`);
    await mutate();
  };

  const goToMembers = (cemId: string) => {
    router.push(`/app/${churchId}/cems/${cemId}/members`);
  };

  const isUserCem = (cemId: string) => cemId === userCem;
  const canViewCem = (cemId: string) => isAdmin || isUserCem(cemId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-gray-500">Carregando Redes...</p>
              </div>
            </div>
          }
        >
          {/* Cabeçalho */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Network className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Nossas Redes
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {cems?.data?.length || 0} {cems?.data?.length === 1 ? 'rede' : 'redes'} cadastradas
                  </p>
                </div>
              </div>
              
              {isAdmin && (
                <Link href={`../${churchId}/cems/new`} className="w-full sm:w-auto">
                  <ButtonNew />
                </Link>
              )}
            </div>
          </div>

          {/* Grid de Cards */}
          {!cems?.data || cems.data.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <Network className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhuma rede cadastrada
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {isAdmin 
                      ? "Clique no botão acima para criar a primeira rede"
                      : "Aguarde até que uma rede seja criada"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {cems.data.map((cem: CellsModel) => {
                const isActive = canViewCem(cem._id);
                const isCurrentUserCem = isUserCem(cem._id);
                
                return (
                  <div key={cem._id} className="group relative">
                    {/* Botão de Edição */}
                    {isAdmin && (
                      <Link
                        href={`../${churchId}/cems/${cem._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 
                                 rounded-full shadow-md opacity-0 group-hover:opacity-100 
                                 transition-opacity duration-200 hover:bg-gray-100 
                                 dark:hover:bg-gray-700"
                      >
                        <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </Link>
                    )}

                    {/* Card da Rede */}
                    <Card
                      className={`
                        relative overflow-hidden rounded-2xl shadow-md 
                        hover:shadow-xl transition-all duration-300 cursor-pointer
                        border-2 h-full
                        ${isCurrentUserCem 
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800' 
                          : isActive 
                            ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300' 
                            : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'
                        }
                        ${isActive ? 'hover:-translate-y-1' : ''}
                      `}
                      onClick={() => goToMembers(cem._id)}
                    >
                      {/* Badge Minha Rede */}
                      {isCurrentUserCem && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1">
                            Minha Rede
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pt-12 pb-4">
                        <div className="flex flex-col items-center text-center space-y-2">
                          {/* Ícone da Rede */}
                          <div className={`
                            p-3 rounded-full mb-2
                            ${isCurrentUserCem 
                              ? 'bg-blue-100 dark:bg-blue-900/40' 
                              : 'bg-gray-100 dark:bg-gray-700'
                            }
                          `}>
                            <Network className={`
                              w-6 h-6
                              ${isCurrentUserCem 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : isActive 
                                  ? 'text-gray-700 dark:text-gray-300' 
                                  : 'text-gray-400'
                              }
                            `} />
                          </div>

                          {/* Nome da Rede */}
                          <CardTitle className={`
                            text-lg sm:text-xl font-bold
                            ${isActive 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-400 dark:text-gray-600'
                            }
                          `}>
                            {cem.name}
                          </CardTitle>

                          {/* Descrição */}
                          {cem.description && (
                            <p className={`
                              text-xs sm:text-sm line-clamp-2 px-2
                              ${isActive 
                                ? 'text-gray-600 dark:text-gray-400' 
                                : 'text-gray-400 dark:text-gray-600'
                              }
                            `}>
                              {cem.description}
                            </p>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 pb-6">
                        {/* Contador de Membros */}
                        <div className={`
                          flex items-center justify-center gap-2 p-4 rounded-xl
                          ${isCurrentUserCem 
                            ? 'bg-blue-100 dark:bg-blue-900/30' 
                            : 'bg-gray-100 dark:bg-gray-700/50'
                          }
                        `}>
                          <Users className={`
                            w-5 h-5
                            ${isCurrentUserCem 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : isActive 
                                ? 'text-gray-700 dark:text-gray-300' 
                                : 'text-gray-400'
                            }
                          `} />
                          <div className="flex items-baseline gap-1">
                            <span className={`
                              text-2xl font-bold
                              ${isCurrentUserCem 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : isActive 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-400'
                              }
                            `}>
                              {cem.membersActive || 0}
                            </span>
                            <span className={`
                              text-sm font-normal
                              ${isActive 
                                ? 'text-gray-600 dark:text-gray-400' 
                                : 'text-gray-400'
                              }
                            `}>
                              {cem.membersActive === 1 ? 'membro' : 'membros'}
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      {/* Indicador visual de hover */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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