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
  Search,
  QrCode,
} from "lucide-react";
import QRCodeScanner from "@/components/Discipulado/QRCodeScanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Toast from "@/components/Toast";
import {
  useAulas,
  useCiclos,
  useCreateCiclo,
  useDeleteAula,
  usePendencias,
  useUpdateAula,
} from "@/hooks/useDiscipulado";
import { AulaDiscipulado } from "@/domain/models/discupulado";
import { capitalizeWords } from "@/utils/capitalizaFirst";
import InscricoesCiclo from "@/components/Discipulado/InscricoesCiclo";

const Discipulado = () => {
  const router = useRouter();
  const { query } = router;
  const churchId = query.churchid as string | undefined;

  const [selectedCiclo, setSelectedCiclo] = useState<string>("");
  const [expandedAula, setExpandedAula] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentAulaForScan, setCurrentAulaForScan] = useState<AulaDiscipulado | null>(null);

  const { data: ciclos = [], refetch: refetchCiclos } = useCiclos(churchId);
  const { data: aulas = [], isLoading: loadingAulas } = useAulas(churchId, selectedCiclo || undefined);
  const { data: pendencias = [] } = usePendencias(churchId, selectedCiclo || undefined);
  const updateAula = useUpdateAula(churchId);
  const deleteAula = useDeleteAula(churchId, () => Toast.showSuccess("Aula excluída"));
  const createCiclo = useCreateCiclo(churchId, () => {
    Toast.showSuccess("Semestre criado com sucesso!");
    setOpenNovoCiclo(false);
  });

  const [openNovoCiclo, setOpenNovoCiclo] = useState(false);
  const [novoCicloNome, setNovoCicloNome] = useState("");
  const [novoCicloInicio, setNovoCicloInicio] = useState("");
  const [novoCicloFim, setNovoCicloFim] = useState("");

  const handleCreateCiclo = () => {
    if (!novoCicloNome || !novoCicloInicio || !novoCicloFim) {
      Toast.showError("Preencha todos os campos do semestre");
      return;
    }
    createCiclo.mutate({
      nome: novoCicloNome,
      dataInicio: new Date(novoCicloInicio).toISOString(),
      dataFim: new Date(novoCicloFim).toISOString(),
      ativo: true, // Make it active by default
    });
  };

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

  const handleOpenScanner = (aula: AulaDiscipulado) => {
    setCurrentAulaForScan(aula);
    setIsScannerOpen(true);
  };

  const handleScanSuccess = (decodedText: string) => {
    if (!currentAulaForScan) return;

    try {
      let studentData;
      try {
        studentData = JSON.parse(decodedText);
      } catch {
        // Fallback for raw ID
        studentData = { _id: decodedText };
      }

      const studentId = studentData._id || studentData.id;
      if (!studentId) {
        Toast.showError("QR Code inválido: ID não encontrado");
        return;
      }

      let aluno = currentAulaForScan.alunos.find((a) => a.membroId === studentId);
      
      if (!aluno) {
        // Auto-adicionar aluno de repósição (semestre anterior) se tiver o QR Code
        aluno = {
          membroId: studentId,
          nome: studentData.nome || "Aluno Identificado Pelo QR",
          rede: { name: "Reposição/Visitante", _id: "" },
          presente: true
        };
        
        const updated = {
          ...currentAulaForScan,
          alunos: [aluno, ...currentAulaForScan.alunos],
        };
        
        updateAula.mutate(updated);
        setCurrentAulaForScan(updated);
        Toast.showSuccess(`Adicionado à aula para reposição: ${capitalizeWords(aluno.nome)}`);
        return;
      }

      if (aluno.presente) {
        Toast.showSuccess(`${capitalizeWords(aluno.nome)} já estava presente`);
        return;
      }

      const updated = {
        ...currentAulaForScan,
        alunos: currentAulaForScan.alunos.map((a) =>
          a.membroId === studentId ? { ...a, presente: true } : a,
        ),
      };

      updateAula.mutate(updated);
      // Atualiza o estado local da aula sendo escaneada para que scans subsequentes funcionem corretamente
      setCurrentAulaForScan(updated);
      Toast.showSuccess(`registrado presença ${capitalizeWords(aluno.nome)}`);
    } catch (error) {
      console.error("Erro ao processar scan:", error);
      Toast.showError("Erro na leitura");
    }
  };

  const totalPresentes = (aula: AulaDiscipulado) => aula.alunos.filter((a) => a.presente).length;
  const totalAusentes = (aula: AulaDiscipulado) => aula.alunos.filter((a) => !a.presente).length;

  const aulasFiltradas = (aulas || []).filter((aula) =>
    aula.tema.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aula.ministrador?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aula.alunos.some(aluno => aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground mt-6">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Discipulado</h1>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={openNovoCiclo} onOpenChange={setOpenNovoCiclo}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Semestre
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Semestre</DialogTitle>
                  <DialogDescription>
                    O semestre ativo receberá as matrículas dos alunos e as novas aulas.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Semestre *</Label>
                    <Input 
                      placeholder="Ex: 1º Semestre 2026" 
                      value={novoCicloNome} 
                      onChange={(e) => setNovoCicloNome(e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data de Início *</Label>
                      <Input 
                        type="date" 
                        value={novoCicloInicio} 
                        onChange={(e) => setNovoCicloInicio(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Fim *</Label>
                      <Input 
                        type="date" 
                        value={novoCicloFim} 
                        onChange={(e) => setNovoCicloFim(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenNovoCiclo(false)}>Cancelar</Button>
                  <Button onClick={handleCreateCiclo} disabled={createCiclo.isLoading}>
                    {createCiclo.isLoading ? "Salvando..." : "Criar Semestre"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={() => router.push(`/app/${churchId}/secretary/discipulado/novaAula`)} 
              className="gap-2"
              disabled={!cicloAtivo}
              title={!cicloAtivo ? "Crie um semestre primeiro" : ""}
            >
              <Plus className="h-4 w-4" />
              Nova Aula
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Tabs defaultValue="aulas" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="aulas">Aulas</TabsTrigger>
            <TabsTrigger value="inscricoes">Inscrições do Ciclo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="aulas" className="mt-6 space-y-6">
            {/* Search and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por tema, ministro ou aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              {/* Ciclo Select can go here if needed */}
            </div>

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
          {/* <Card>
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
          </Card> */}
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
            {(aulasFiltradas || []).map((aula) => (
              <AccordionItem
                key={aula.id}
                value={aula.id}
                className="border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  <div className="flex items-center gap-4 text-left flex-1 min-w-0">
                    {/* Modern Date Badge */}
                    <div className="flex flex-col items-center justify-center bg-primary/10 border border-primary/20 rounded-lg w-14 h-14 shrink-0 transition-colors group-hover:bg-primary/20">
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider leading-none mb-1">
                        {format(new Date(aula.data), "MMM", { locale: ptBR })}
                      </span>
                      <span className="text-xl font-black text-primary leading-none">
                        {format(new Date(aula.data), "dd")}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="font-bold text-base text-card-foreground leading-tight truncate pr-2">
                        {aula.tema}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="shrink-0 opacity-70">ministrado por</span>
                        <span className="font-medium text-foreground/80 truncate">
                          {aula.ministrador?.nome}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mr-2 shrink-0">
                      <div className="hidden sm:flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/5 border border-primary/10">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-bold text-primary">{totalPresentes(aula)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/5 border border-destructive/10">
                          <XCircle className="h-3.5 w-3.5 text-destructive" />
                          <span className="text-xs font-bold text-destructive">{totalAusentes(aula)}</span>
                        </div>
                      </div>

                      {/* Compact Stats for Mobile */}
                      <div className="flex sm:hidden items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-xs font-bold">{totalPresentes(aula)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                          <span className="text-xs font-bold text-muted-foreground">{totalAusentes(aula)}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Aula</AlertDialogTitle>
                              <AlertDialogDescription>
                                Realmente você deseja excluir a aula e todos os alunos?
                                Esta ação não poderá ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAula(aula.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex flex-wrap items-center justify-end mb-4 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenScanner(aula)}
                      className="gap-2 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary h-10 px-4 flex-1 sm:flex-none shadow-sm"
                    >
                      <QrCode className="h-4 w-4" />
                      Presença por QR Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAula(aula)}
                      className="gap-2 h-10 px-4 flex-1 sm:flex-none shadow-sm"
                    >
                      <Edit3 className="h-4 w-4" />
                      Editar Aula
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
                          <TableCell className="font-medium">{capitalizeWords(aluno.nome)}</TableCell>
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
          </TabsContent>

          <TabsContent value="inscricoes">
            {cicloAtivo ? (
              <InscricoesCiclo 
                churchId={churchId} 
                ciclo={cicloAtivo} 
                onRefresh={refetchCiclos} 
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card mt-6">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Nenhum semestre/ciclo ativo encontrado.</p>
                <p className="text-sm mt-1">Crie um Novo Semestre para começar a matricular os alunos.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 gap-2"
                  onClick={() => setOpenNovoCiclo(true)}
                >
                  <Plus className="h-4 w-4" /> Criar Semestre
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {isScannerOpen && currentAulaForScan && (
        <QRCodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => {
            setIsScannerOpen(false);
            setCurrentAulaForScan(null);
          }}
          totalAlunos={currentAulaForScan.alunos.length}
          totalPresentes={currentAulaForScan.alunos.filter((a) => a.presente).length}
          tema={currentAulaForScan.tema}
        />
      )}
    </div>
  );
};

export default Discipulado;