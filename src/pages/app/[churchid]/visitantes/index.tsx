"use client";

import { useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { TVisitor, VisitantesModel } from "@/domain/models/visitantes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHttpGet, useHttpPost } from "@/hooks/api";
import * as XLSX from "xlsx";
import Toast from "@/components/Toast";
import Pagination from "@/components/Pagination";
import { formatDate } from "@/utils/formatedDate";
import { PageHeader } from "@/components/PageHeader";

export default function VisitantesList() {
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
  } = useHttpGet<{
    data: VisitantesModel[];
    total: number;
    page: number;
    totalPages: number;
  }>(`/api/protected/churches/${churchId}/visitantes?page=${page}&limit=${limit}`);

  const filteredRecords = useMemo(() => {
    if (!users?.data) return [];
    return users.data?.data?.filter((r: VisitantesModel) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users?.data, search]);

  const getHowHeardLabel = (value: string) => {
    const mapping: Record<string, string> = {
      invited: TVisitor.invited,
      instagram: TVisitor.instagram,
      facebook: TVisitor.facebook,
      youtube: TVisitor.youtube,
      other: TVisitor.other,
    };
    return mapping[value] || value || "-";
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      setLoading(true);
      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/visitantes/import`,
        data: json,
      });
      setLoading(false);

      if (response?.error) {
        Toast.showError("Erro na importação!");
      } else {
        Toast.showSuccess("Importado com sucesso!");
        mutate();
      }
    } catch (error) {
      setLoading(false);
      console.error("[IMPORT_ERROR]:", error);
      Toast.showError("Erro durante o processo de importação.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="p-4 mt-6 w-full max-w-6xl mx-auto">
      <PageHeader
        title="Visitantes"
        totalLabel="Total de Visitantes"
        totalCount={users?.data.total || 0}
        loading={isLoading || loading}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleImport}
        />

        <Button
          type="button"
          className="bg-green-500 text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          Importar
        </Button>

        <Button onClick={() => router.push(router.asPath + "/novo")}>Novo</Button>
      </PageHeader>

      {/* Conteúdo */}
      {loading || isLoading ? (
        <div className="text-center py-6 text-gray-500">Carregando...</div>
      ) : (
        <>
          {/* Versão mobile (cards) */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredRecords?.map((r) => (
              <div key={r._id} className="border rounded-xl p-3 shadow-sm bg-white">
                <div className="font-semibold text-lg">{r.name}</div>

                {r.phone && (
                  <div className="text-sm text-gray-700">
                    📱 <span className="font-medium">WhatsApp:</span> {r.phone}
                  </div>
                )}
                {r.region && (
                  <div className="text-sm text-gray-700">
                    📍 <span className="font-medium">Região:</span> {r.region}
                  </div>
                )}
                {r.howHeard && (
                  <div className="text-sm text-gray-700">
                    💬 <span className="font-medium">Como nos conheceu:</span>{" "}
                    {getHowHeardLabel(r.howHeard)}
                  </div>
                )}
                {r.invitedBy && (
                  <div className="text-sm text-gray-700">
                    🙋 <span className="font-medium">Quem convidou:</span> {r.invitedBy}
                  </div>
                )}
                <div className="text-sm text-gray-700">
                  📅 <span className="font-medium">Data da visita:</span> {formatDate(r.visitedAt)}
                </div>
              </div>
            ))}
          </div>

          {/* Versão desktop (tabela) */}
          <div className="hidden md:block overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Região</TableHead>
                  <TableHead>Como nos conheceu</TableHead>
                  <TableHead>Quem convidou</TableHead>
                  <TableHead>Data da visita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords?.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.phone || "-"}</TableCell>
                    <TableCell>{r.region || "-"}</TableCell>
                    <TableCell>{getHowHeardLabel(r.howHeard as string)}</TableCell>
                    <TableCell>{r.invitedBy || "-"}</TableCell>
                    <TableCell> {formatDate(r.visitedAt)}</TableCell>
                  </TableRow>
                ))}
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
}
