"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHttpGet } from "@/hooks/api";
import { AceitouModel } from "@/domain/models/aceitou";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination";
import { formatDate } from "@/utils/formatedDate";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";

export const AceitouJesusList = () => {
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [redeFilter, setRedeFilter] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  // Construir URL com filtros
  const buildFilterUrl = () => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    if (search) params.set('name', search);
    if (redeFilter) params.set('rede', redeFilter);
    if (dateStart) params.set('dateStart', dateStart);
    if (dateEnd) params.set('dateEnd', dateEnd);

    return `/api/protected/churches/${churchId}/aceitou?${params.toString()}`;
  };

  const {
    data: users,
    isLoading,
    mutate,
  } = useHttpGet<{ data: AceitouModel[]; total: number; page: number; totalPages: number }>(
    buildFilterUrl()
  );

  const clearFilters = () => {
    setSearch("");
    setRedeFilter("");
    setDateStart("");
    setDateEnd("");
    setPage(1);
  };

  return (
    <div className="w-full max-w-6xl p-4 mx-auto mt-6">
      <PageHeader
        title="Lista Aceitou Jesus"
        totalLabel="Total de Pessoas"
        totalCount={users?.data.total || 0}
        loading={isLoading || loading}
      >
        <Button onClick={() => router.push(router.asPath + "/novo")}>Novo</Button>
      </PageHeader>

      {/* Filtros */}
      <div className="mt-4 mb-6 bg-white dark:bg-dark-secondary border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </h3>
          {(search || redeFilter || dateStart || dateEnd) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs h-8"
            >
              <X className="w-3 h-3 mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por nome */}
          <div className="md:col-span-2 lg:col-span-1">
            <Label htmlFor="search-name" className="text-xs">Nome</Label>
            <Input
              id="search-name"
              placeholder="Buscar por nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Filtro por rede */}
          <div className="md:col-span-2 lg:col-span-1">
            <Label htmlFor="filter-rede" className="text-xs">Rede / CEM</Label>
            <Input
              id="filter-rede"
              placeholder="Buscar por rede"
              value={redeFilter}
              onChange={(e) => setRedeFilter(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Filtro data inicial */}
          <div>
            <Label htmlFor="date-start" className="text-xs">Data inicial</Label>
            <Input
              id="date-start"
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Filtro data final */}
          <div>
            <Label htmlFor="date-end" className="text-xs">Data final</Label>
            <Input
              id="date-end"
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      {loading || isLoading ? (
        <div className="py-6 text-center text-gray-500">Carregando...</div>
      ) : (
        <>
          {/* Versão mobile (cards) */}
          <div className="flex flex-col gap-3 md:hidden">
            {users?.data?.data?.map((r: AceitouModel) => (
              <div key={r._id} className="p-3 bg-white dark:bg-dark-secondary border shadow-sm rounded-xl">
                <div className="text-lg font-semibold dark:text-gray-200">{r.name}</div>
                <div className="flex justify-between pr-5">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    † {r.accepted ? "Aceitou" : "Reconciliou"}
                  </div>

                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Batizado:</span> {r.baptism ? "Sim" : "Não"}
                  </div>
                </div>
                {r.phone && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    📱 <span className="font-medium">WhatsApp:</span> {r.phone}
                  </div>
                )}

                <div className="text-sm text-gray-700 dark:text-gray-300">
                  📅 <span className="font-medium">Data do Apelo:</span> {formatDate(r.acceptedAt)}
                  {r.rede && (
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      🙋 <span className="font-medium">Quem convidou: </span>
                      {r.rede.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto border rounded-md md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Rede / CEM</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Batizado</TableHead>
                  <TableHead>Encontro</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!users?.data?.data || users.data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-4 text-center">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.data.data.map((r: AceitouModel) => (
                    <TableRow key={r._id}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.email || "-"}</TableCell>
                      <TableCell>{r.phone || "-"}</TableCell>
                      <TableCell>{r.rede?.name || "-"}</TableCell>
                      <TableCell>{formatDate(r.acceptedAt)}</TableCell>{" "}
                      <TableCell>{r.accepted ? "Aceitou" : "Reconciliou"}</TableCell>
                      <TableCell>{r.baptism ? "Sim" : "Não"}</TableCell>
                      <TableCell>{r.numberEncontro || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      {users?.data.totalPages && (
        <Pagination
          currentPage={page}
          pageSize={limit}
          items={users.data.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default AceitouJesusList;
