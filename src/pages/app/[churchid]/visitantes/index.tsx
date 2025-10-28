"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { VisitantesModel } from "@/domain/models/visitantes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHttpGet } from "@/hooks/api";
import { Input } from "@/components/ui/input";

export default function VisitantesList() {
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const path = router.asPath;

  const {
    data: users,
    isLoading,
    mutate,
  } = useHttpGet<VisitantesModel[]>(`/api/protected/churches/${churchId}/visitantes`);

  // Memoiza o filtro para evitar recalcular toda hora
  const filteredRecords = useMemo(() => {
    if (!users?.data) return [];
    return users.data.filter((r: VisitantesModel) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users?.data, search]);

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <Label className="text-2xl">Visitantes</Label>
        <div className="flex flex-row gap-2">
          <Input
            name=""
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => router.push(router.asPath + "/novo")}>Novo</Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Região</TableHead>
              <TableHead>Como nos conheceu</TableHead>
              <TableHead>Quem Convidou</TableHead>
              <TableHead>Data da Visita</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.phone || "-"}</TableCell>
                  <TableCell>{r.region || "-"}</TableCell>
                  <TableCell>{r.howHeard || "-"}</TableCell>
                  <TableCell>{r.invitedBy || "-"}</TableCell>
                  <TableCell>
                    {new Date(r.visitedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </TableCell>{" "}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
