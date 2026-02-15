"use client";

import { useMemo, useState } from "react";
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

export const AceitouJesusList = () => {
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: users,
    isLoading,
    mutate,
  } = useHttpGet<{ data: AceitouModel[]; total: number; page: number; totalPages: number }>(
    `/api/protected/churches/${churchId}/aceitou?page=${page}&limit=${limit}`
  );

  // Memoiza o filtro para evitar recalcular toda hora
  const filteredRecords = useMemo(() => {
    if (!users?.data) return [];
    return users.data?.data?.filter((r: AceitouModel) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users?.data, search]);

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

      {/* Conteúdo */}
      {loading || isLoading ? (
        <div className="py-6 text-center text-gray-500">Carregando...</div>
      ) : (
        <>
          {/* Versão mobile (cards) */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredRecords?.map((r) => (
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
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-4 text-center">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((r) => (
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
