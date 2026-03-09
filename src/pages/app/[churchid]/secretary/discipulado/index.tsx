import { useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Plus,
  BookOpen,
  Users,
  CalendarDays,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Toast from "@/components/Toast";
import {
 useAulas,
 useCiclos,
 useDeleteAula,
 usePendencias,
 useUpdateAula,
} from "@/hooks/useDiscipulado";
import { AulaDiscipulado } from "@/domain/models/discupulado";

const Discipulado = () => {
 const router= useRouter();
 const { query } = router;
 const churchId= query.churchid as string | undefined;
  
 const [selectedCiclo, setSelectedCiclo] = useState<string>("");
 const [expandedAula, setExpandedAula] = useState<string>("");

 const { data: ciclos = [] } = useCiclos(churchId);
 const { data: aulas = [], isLoading: loadingAulas } = useAulas(churchId, selectedCiclo || undefined);
 const { data: pendencias = [] } = usePendencias(churchId, selectedCiclo || undefined);
 const updateAula = useUpdateAula(churchId);
 const deleteAula = useDeleteAula(churchId, () => Toast.showSuccess("Aula excluída"));

 const cicloAtivo = ciclos?.find((c) => c.ativo) || ciclos?.[0];
  if (!selectedCiclo && cicloAtivo) {
    setSelectedCiclo(cicloAtivo.id);
  }

  const handleTogglePresenca = (aula: AulaDiscipulado, membroId: string) => {
    const updated = {
      ...aula,
      alunos: aula.alunos.map((a) =>
        a.membroId === membroId ? { ...a, presente: !a.presente } : a,
      ),
    };
    updateAula.mutate(updated);
  };

 const handleDeleteAula = (id: string) => {
    deleteAula.mutate(id);
  };

const handleEditAula = (aula: AulaDiscipulado) => {
  router.push(`/app/${churchId}/secretary/discipulado/editarAula?id=${aula.id}`);
  };

  const totalPresentes = (aula: AulaDiscipulado) => aula.alunos.filter((a) => a.presente).length;
  const totalAusentes = (aula: AulaDiscipulado) => aula.alunos.filter((a) => !a.presente).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Discipulado</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* <Select value={selectedCiclo} onValueChange={setSelectedCiclo}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecione o ciclo" />
              </SelectTrigger>
              <SelectContent>
                {(ciclos || []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome} {c.ativo && "●"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <Button onClick={() => router.push(`/app/${churchId}/secretary/discipulado/novaAula`)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Aula
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <CalendarDays className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{aulas?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Aulas no ciclo</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set((aulas || []).flatMap((a) => a.alunos.map((al) => al.membroId))).size}
                </p>
                <p className="text-sm text-muted-foreground">Alunos matriculados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{pendencias?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Pendências de reposição</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pendências */}
        {(pendencias?.length || 0) > 0 && (
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Alunos com pendência de reposição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Célula</TableHead>
                    <TableHead>Aulas pendentes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(pendencias || []).map((p) => (
                    <TableRow key={p.membroId}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell>{p.rede.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.aulasPendentes.map((tema) => (
                            <Badge key={tema} variant="destructive" className="text-xs">
                              {tema}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Aulas */}
        {loadingAulas ? (
          <p className="text-muted-foreground text-center py-12">Carregando aulas...</p>
        ) : (aulas?.length || 0) === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Nenhuma aula cadastrada neste ciclo.</p>
              <p className="text-sm mt-1">Clique em "Nova Aula" para começar.</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion
            type="single"
            collapsible
            value={expandedAula}
            onValueChange={setExpandedAula}
            className="space-y-3"
          >
            {(aulas || []).map((aula) => (
              <AccordionItem
                key={aula.id}
                value={aula.id}
                className="border rounded-lg bg-card overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-4 text-left flex-1">
                    <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-1.5 min-w-[60px]">
                      <span className="text-xs text-primary font-medium uppercase">
                        {format(new Date(aula.data), "MMM", { locale: ptBR })}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {format(new Date(aula.data), "dd")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{aula.tema}</p>
                      <p className="text-sm text-muted-foreground">
                        Ministrado por {aula.ministrador?.nome}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mr-4">
                      <div className="flex items-center gap-1 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{totalPresentes(aula)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span>{totalAusentes(aula)}</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex justify-end mb-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAula(aula)}
                      className="gap-1"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAula(aula.id)}
                      className="gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Rede</TableHead>
                        <TableHead className="text-center">Presença</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aula.alunos.map((aluno) => (
                        <TableRow key={aluno.membroId}>
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell className="text-muted-foreground">{aluno.rede.name}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={aluno.presente}
                              onCheckedChange={() => handleTogglePresenca(aula, aluno.membroId)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {aula.alunos.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                            Nenhum aluno nesta aula
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default Discipulado;
