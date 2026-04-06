"use client";

import { useRef, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Filter, Loader2 as ExportLoader, X } from "lucide-react";

export default function VisitantesList() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("pdf");
  const [exporting, setExporting] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Construir URL com filtros
  const buildFilterUrl = () => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    if (search) params.set('name', search);
    if (dateStart) params.set('dateStart', dateStart);
    if (dateEnd) params.set('dateEnd', dateEnd);

    return `/api/protected/churches/${churchId}/visitantes?${params.toString()}`;
  };

  const handleExport = () => {
    if (!churchId || exporting) return;
    setExporting(true);

    const params = new URLSearchParams();
    params.set("format", exportFormat);
    if (search) params.set("name", search);
    if (dateStart) params.set("dateStart", dateStart);
    if (dateEnd) params.set("dateEnd", dateEnd);

    const url = `/api/protected/churches/${churchId}/visitantes/export?${params.toString()}`;
    window.open(url, "_blank");

    setTimeout(() => setExporting(false), 2000);
  };

  const {
    data: users,
    isLoading,
    mutate,
  } = useHttpGet<{
    data: VisitantesModel[];
    total: number;
    page: number;
    totalPages: number;
  }>(buildFilterUrl());

  const clearFilters = () => {
    setSearch("");
    setDateStart("");
    setDateEnd("");
    setPage(1);
  };

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

        {/* <Button
          type="button"
          className="bg-green-500 text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          Importar
        </Button> */}

        <Button onClick={() => router.push(router.asPath + "/novo")}>Novo</Button>
      </PageHeader>

      {/* Filtros */}
      <div className="mt-4 mb-6 bg-white dark:bg-dark-secondary border rounded-lg shadow-sm">

        {/* Header do collapse (visível no mobile) / Header normal (desktop) */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer md:cursor-default"
          onClick={() => setFiltersOpen((prev) => !prev)}
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </h3>
          <div className="flex items-center gap-2">
            {(search || dateStart || dateEnd) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                className="text-xs h-8"
              >
                <X className="w-3 h-3 mr-1" />
                Limpar filtros
              </Button>
            )}
            {/* Chevron só aparece no mobile */}
            <span className="md:hidden text-gray-400 transition-transform duration-200" style={{ transform: filtersOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
              ▾
            </span>
          </div>
        </div>

        {/* Conteúdo dos filtros: sempre visível no desktop, colapsa no mobile */}
        <div className={`px-4 pb-4 ${filtersOpen ? "block" : "hidden"} md:block`}>

          {/* Desktop: 3 colunas na mesma linha | Mobile: empilhado */}
          {/* Desktop: tudo em uma linha | Mobile: empilhado */}
          <div className="flex flex-col md:flex-row md:items-end gap-4">

            {/* Nome */}
            <div className="flex-1 min-w-0">
              <Label htmlFor="search-name" className="text-xs">Nome</Label>
              <Input
                id="search-name"
                placeholder="Buscar por nome"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Data inicial */}
            <div className="flex-1 min-w-0">
              <Label htmlFor="date-start" className="text-xs">Data inicial</Label>
              <Input
                id="date-start"
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Data final */}
            <div className="flex-1 min-w-0">
              <Label htmlFor="date-end" className="text-xs">Data final</Label>
              <Input
                id="date-end"
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Exportar — inline no desktop, separado no mobile */}
            <div className="flex-shrink-0 md:pb-0">
              <Label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                <Download className="w-3 h-3" />
                Exportar
              </Label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm">
                <select
                  id="export-format-visitantes"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as "pdf" | "excel")}
                  className="px-3 w-full py-2 text-sm bg-white dark:bg-dark-tertiary dark:text-gray-700 border-r border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-400 cursor-pointer"
                  aria-label="Formato de exportação"
                >
                  <option value="pdf">📄 PDF</option>
                  <option value="excel">📊 Excel (.xlsx)</option>
                </select>
                <button
                  id="btn-export-visitantes"
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 dark:bg-orange-500 text-white hover:bg-blue-700 dark:hover:bg-orange-600 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {exporting ? (
                    <ExportLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      {loading || isLoading ? (
        <div className="text-center py-6 text-gray-500">Carregando...</div>
      ) : (
        <>
          {/* Versão mobile (cards) */}
          <div className="flex flex-col gap-3 md:hidden">
            {users?.data?.data?.map((r: VisitantesModel) => (
              <div key={r._id} className="border rounded-xl p-3 shadow-sm bg-white dark:bg-dark-secondary">
                <div className="font-semibold text-lg">{r.name}</div>

                {r.phone && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    📱 <span className="font-medium">WhatsApp:</span> {r.phone}
                  </div>
                )}
                {r.region && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    📍 <span className="font-medium">Região:</span> {r.region}
                  </div>
                )}
                {r.howHeard && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    💬 <span className="font-medium">Como nos conheceu:</span>{" "}
                    {getHowHeardLabel(r.howHeard)}
                  </div>
                )}
                {r.invitedBy && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    🙋 <span className="font-medium">Quem convidou:</span> {r.invitedBy}
                  </div>
                )}
                <div className="text-sm text-gray-700 dark:text-gray-300">
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
                {users?.data?.data?.map((r: VisitantesModel) => (
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
