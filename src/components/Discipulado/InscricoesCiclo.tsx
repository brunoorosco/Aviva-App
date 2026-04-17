import { useState } from "react";
import { Search, UserPlus, Trash2, Send, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActiveUsersWithNetwork, useAddInscrito, useRemoveInscrito } from "@/hooks/useDiscipulado";
import { CicloDiscipulado } from "@/domain/models/discupulado";
import Toast from "@/components/Toast";
import { capitalizeWords } from "@/utils/capitalizaFirst";

export default function InscricoesCiclo({
  churchId,
  ciclo,
  onRefresh,
}: {
  churchId?: string;
  ciclo: CicloDiscipulado;
  onRefresh?: () => void;
}) {
  const [busca, setBusca] = useState("");
  const [membroSelecionado, setMembroSelecionado] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data: usuariosAtivos = [] } = useActiveUsersWithNetwork(churchId);

  const addInscrito = useAddInscrito(churchId, ciclo.id, () => {
    onRefresh?.();
  });

  const removeInscrito = useRemoveInscrito(churchId, ciclo.id, () => {
    Toast.showSuccess("Matrícula removida com sucesso");
    onRefresh?.();
  });

  const inscritos = ciclo.inscritos || [];

  const usuariosFiltrados = (usuariosAtivos || [])
    .filter((u) => !inscritos.some((inscrito) => inscrito.id === u._id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleAddInscrito = (usuarioId: string) => {
    const usuario = usuariosAtivos?.find((u) => u._id === usuarioId);
    if (!usuario) return;

    setLoadingId(usuarioId);
    addInscrito.mutate({
      id: usuario._id,
      nome: usuario.name,
      rede: { name: usuario.rede?.name || "-", _id: usuario.rede?._id || "" },
    }).then((res: any) => {
      if (res && res.message) {
        Toast.showSuccess(res.message);
      }
    }).catch((err) => {
      Toast.showError(err.message || "Erro ao adicionar aluno");
    }).finally(() => {
      setLoadingId(null);
    });
    setMembroSelecionado("");
  };

  const handleRemoveInscrito = (membroId: string) => {
    setLoadingId(membroId);
    removeInscrito.mutate(membroId).finally(() => setLoadingId(null));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Matricular Alunos no Ciclo Ativo</h2>
            </div>
            <span className="text-sm text-muted-foreground font-medium bg-secondary px-3 py-1 rounded-full">
              {inscritos.length} matriculados
            </span>
          </div>

          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Buscar membro da igreja</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o nome para buscar..."
                  value={membroSelecionado}
                  onChange={(e) => setMembroSelecionado(e.target.value)}
                  className="pl-9"
                />
              </div>

              {membroSelecionado && (
                <div className="border border-border rounded-lg bg-card/50 max-h-[300px] overflow-y-auto shadow-md">
                  {(usuariosFiltrados.filter((u) =>
                    u.name.toLowerCase().includes(membroSelecionado.toLowerCase()),
                  ) || []).map((usuario) => (
                    <div
                      key={usuario._id}
                      onClick={() => handleAddInscrito(usuario._id)}
                      className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-0 flex items-center justify-between transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{capitalizeWords(usuario.name)}</span>
                        <span className="text-xs text-muted-foreground">
                          {usuario.rede?.name || "Sem rede"} • {usuario.role}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 h-8"
                        disabled={loadingId === usuario._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddInscrito(usuario._id);
                        }}
                      >
                        {loadingId === usuario._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserPlus className="h-3 w-3" />
                        )}
                        Matricular
                      </Button>
                    </div>
                  ))}
                  {usuariosFiltrados.filter((u) =>
                    u.name.toLowerCase().includes(membroSelecionado.toLowerCase()),
                  ).length === 0 && (
                      <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                        Nenhum membro encontrado ou já matriculado.
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b bg-card rounded-t-xl flex items-center justify-between">
            <h3 className="font-medium text-base">Alunos Matriculados</h3>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filtrar lista..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>
          {inscritos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Rede/Célula</TableHead>
                  <TableHead>QR Code Enviado</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inscritos
                  .filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase()))
                  .sort((a, b) => a.nome.localeCompare(b.nome))
                  .map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-medium">{capitalizeWords(aluno.nome)}</TableCell>
                      <TableCell className="text-muted-foreground">{aluno.rede.name}</TableCell>
                      <TableCell>
                        {aluno.dataEnvioQRCode ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <Send className="h-3 w-3" /> Enviado
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(aluno.dataEnvioQRCode).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-destructive font-medium flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Não enviado
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAddInscrito(aluno.id)}
                          disabled={loadingId === aluno.id}
                          title="Reenviar QR Code"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        >
                          {loadingId === aluno.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveInscrito(aluno.id)}
                          disabled={loadingId === aluno.id}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {loadingId === aluno.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <UserPlus className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum aluno matriculado neste ciclo ainda.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
