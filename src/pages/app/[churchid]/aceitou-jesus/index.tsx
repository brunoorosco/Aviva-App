"use client";

import { useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHttpGet } from "@/hooks/api";
import { AceitouModel } from "@/domain/models/aceitou";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination";

export const AceitouJesusList = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      <div className="flex justify-between gap-2 mb-4 items-left">
        <div className="flex flex-col">
          <Label className="text-2xl">Lista Aceitou Jesus</Label>
          <Label className="text-xs font-semibold">{`Total de Pessoas - ${users?.data.total}`}</Label>
        </div>

        <div className="flex flex-row gap-2">
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => router.push(router.asPath + "/novo")}>Novo</Button>
        </div>
      </div>
      {/* Conteúdo */}
      {loading || isLoading ? (
        <div className="py-6 text-center text-gray-500">Carregando...</div>
      ) : (
        //  ) : filteredRecords?.length === 0 ? (
        //   <div className="py-6 text-center text-gray-500">Nenhum registro encontrado</div>
        <>
          {/* Versão mobile (cards) */}
          <div className="flex flex-col gap-3 md:hidden">
            {users?.data.data?.map((r) => (
              <div key={r._id} className="p-3 bg-white border shadow-sm rounded-xl">
                <div className="text-lg font-semibold">{r.name}</div>
                <div className="flex justify-between pr-5">
                  <div className="text-sm font-semibold text-gray-700">
                    † {r.accepted ? "Aceitou" : "Reconciliou"}
                  </div>

                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Batizado:</span> {r.baptism ? "Sim" : "Não"}
                  </div>
                </div>
                {r.phone && (
                  <div className="text-sm text-gray-700">
                    📱 <span className="font-medium">WhatsApp:</span> {r.phone}
                  </div>
                )}

                <div className="text-sm text-gray-700">
                  📅 <span className="font-medium">Data do Apelo:</span>{" "}
                  {new Date(r.acceptedAt).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                  {r.rede && (
                    <div className="text-sm font-medium text-gray-700">
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-4 text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
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
                      <TableCell>
                        {new Date(r.acceptedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                      </TableCell>{" "}
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
