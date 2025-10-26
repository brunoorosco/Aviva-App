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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHttpGet } from "@/hooks/api";
import { AceitouModel } from "@/domain/models/aceitou";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export const AceitouJesusList = () => {
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
  } = useHttpGet<AceitouModel[]>(`/api/protected/churches/${churchId}/aceitou`);

  // Memoiza o filtro para evitar recalcular toda hora
  const filteredRecords = useMemo(() => {
    if (!users?.data) return [];
    return users.data.filter((r: AceitouModel) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users?.data, search]);

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <Label className="text-2xl">Lista Aceitou Jesus</Label>
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

      <div className="overflow-x-auto border rounded-md">
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
                  <TableCell>{r.email || "-"}</TableCell>
                  <TableCell>{r.phone || "-"}</TableCell>
                  <TableCell>{r.rede?.name || "-"}</TableCell>
                  <TableCell>
                    {new Date(r.acceptedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </TableCell>{" "}
                  <TableCell>{r.accepted ? "Reconciliou" : "Aceitou"}</TableCell>
                  <TableCell>{r.baptism ? "Sim" : "Não"}</TableCell>
                  <TableCell>{r.numberEncontro || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AceitouJesusList;
