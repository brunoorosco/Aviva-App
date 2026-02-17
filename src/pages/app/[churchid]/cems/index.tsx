"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useHttpGet, useHttpDelete } from "@/hooks/api";
import Pagination from "@/components/Pagination";
import CemHeader from "@/components/cems/CemHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Home, Loader2, MapPin, Trash2 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { ROLES } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import Toast from "@/components/Toast";
import { CemsModel } from "@/domain/models/cems";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const CemsList = () => {
  const router = useRouter();
  const { asPath, query, isReady } = router;
  const { churchid } = query;
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const { hasPermission } = usePermissions();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBatismo, setSelectedBatismo] = useState<CemsModel | null>(null);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    onConfirm?: () => void;
  }>({ open: false });
  // Verificar se pode deletar (apenas admin e secretaria)
  const canDelete = hasPermission([ROLES.ADMIN, ROLES.SECRETARIA]);

  if (!isReady || !churchid) return null;

  const { data: cems, mutate: refreshMembers } = useHttpGet<{
    total: number;
    page: number;
    data: CemsModel[];
    totalPages: number;
  }>(`/api/protected/churches/${churchid}/cems?page=${page}&limit=${limit}`);

  const handleDelete = async (e: React.MouseEvent, grupo: CemsModel) => {
    e.preventDefault(); // Evita navegação do Link
    e.stopPropagation();
    openConfirm(
      "Remover Cem's",
      `Tem certeza que deseja remover o período de ${formatDate(grupo.data_inicial)} com ${grupo.casas.length} cem's?\n\nEsta ação não pode ser desfeita.`,

      async () => {
        try {
          await useHttpDelete({
            url: `/api/protected/churches/${session?.user.churchId}/cems/${grupo._id}`,
          });

          Toast.showSuccess("Cem's removida com sucesso!");
          closeConfirm();
          await refreshMembers();
        } catch (error) {
          Toast.showError("Erro ao remover Cem`s!");
          console.error("Erro ao deletar:", error);
        }
      },
    );
  };

  const openConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirm({ open: true, title, description, onConfirm });
  };

  const closeConfirm = () => setConfirm({ open: false });

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "";
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  return (
    <div className="min-h-screen bg-background from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        {cems && (
          <div className="mb-6">
            <CemHeader pathname={asPath} inputFileRef={inputFileRef} casasdepaz={cems?.data.data} />
          </div>
        )}

        {/* Loading State */}
        {!cems ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-orange-500" />
              <p className="text-gray-500 dark:text-gray-400">Carregando Cem's...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Lista de Casas de Paz */}
            {cems.data.data.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhuma Cem's encontrada
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Comece adicionando a primeira Cem's
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {cems.data.data?.map((grupo: CemsModel) => (
                  <div key={grupo._id} className="group relative">
                    <Link href={`${asPath}/${grupo._id}`} className="block">
                      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500">
                        <CardContent className="p-6">
                          {/* Ícone e Badge */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-orange-900/30 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-orange-900/50 transition-colors">
                              <Home className="w-6 h-6 text-blue-600 dark:text-orange-500" />
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            >
                              {grupo.casas.length} {grupo.casas.length === 1 ? "casa" : "casas"}
                            </Badge>
                          </div>

                          {/* Data */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm font-medium">
                                {formatDate(grupo.data_inicial) || "Data não definida"}
                              </span>
                            </div>

                            {/* Informação adicional */}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Cem's realizadas:
                              </p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-blue-600 dark:text-orange-500">
                                  {grupo.casas.length}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {grupo.casas.length === 1 ? "casa" : "casas"}
                                </span>
                              </div>
                            </div>

                            {/* Preview das primeiras redes (se houver) */}
                            {grupo.casas.length > 0 && (
                              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Redes participantes:
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {Array.from(new Set(grupo.casas.map((c) => c.rede)))
                                    .filter(Boolean)
                                    .slice(0, 3)
                                    .map((rede, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs px-2 py-0.5"
                                      >
                                        {rede}
                                      </Badge>
                                    ))}
                                  {Array.from(new Set(grupo.casas.map((c) => c.rede))).length >
                                    3 && (
                                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                                      +
                                      {Array.from(new Set(grupo.casas.map((c) => c.rede))).length -
                                        3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Indicador de hover */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg" />
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Botão de Remover (apenas para admin e secretaria) */}
                    {canDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10"
                        onClick={(e) => handleDelete(e, grupo)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <ConfirmDialog
              open={confirm.open}
              onClose={closeConfirm}
              onConfirm={confirm.onConfirm ?? closeConfirm}
              title={confirm.title}
              description={confirm.description}
            />

            {/* Paginação */}
            {cems?.data.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  pageSize={limit}
                  items={cems.data.total}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CemsList;
