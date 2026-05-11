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
  Loader2,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import { useEffect, useCallback, useRef } from "react";
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
  useUpdatePresencaAluno,
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastMarkedName, setLastMarkedName] = useState("");

  const { data: ciclos = [], refetch: refetchCiclos } = useCiclos(churchId);
  const { data: aulas = [], isLoading: loadingAulas, refetch: refetchAulas } = useAulas(churchId, selectedCiclo || undefined);
  const { data: pendencias = [], refetch: refetchPendencias } = usePendencias(churchId, selectedCiclo || undefined);

  const updateAula = useUpdateAula(churchId, () => {
    refetchAulas();
    refetchPendencias();
  });

  const updatePresenca = useUpdatePresencaAluno(churchId, () => {
    refetchAulas();
    refetchPendencias();
  });

  // Gerenciamento de Fila de Sincronização (Cache Local)
  const [syncQueue, setSyncQueue] = useState<{ aulaId: string, membroId: string, presente: boolean, studentData: any, timestamp: number }[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncInProgress = useRef(false);

  // Carregar fila inicial do localStorage
  useEffect(() => {
    const savedQueue = localStorage.getItem("discipulado_presence_sync_queue");
    if (savedQueue) {
      try {
        setSyncQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error("Erro ao carregar fila de sincronização", e);
      }
    }
  }, []);

  // Salvar fila no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("discipulado_presence_sync_queue", JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Processador da fila
  const processSyncQueue = useCallback(async () => {
    if (syncInProgress.current || syncQueue.length === 0) return;

    syncInProgress.current = true;
    setIsSyncing(true);

    const nextItem = syncQueue[0];
    try {
      await updatePresenca.mutate({
        aulaId: nextItem.aulaId,
        membroId: nextItem.membroId,
        presente: nextItem.presente,
        studentData: nextItem.studentData
      });

      // Remover item processado da fila
      setSyncQueue(prev => prev.slice(1));
    } catch (error) {
      console.error("Erro ao sincronizar presença:", error);
      // Para evitar loop infinito em erro fixo, poderíamos remover ou alertar
    } finally {
      syncInProgress.current = false;
      setIsSyncing(false);
    }
  }, [syncQueue, updatePresenca]);

  // Efeito para processar a fila automaticamente
  useEffect(() => {
    if (syncQueue.length > 0 && !isSyncing) {
      const timer = setTimeout(processSyncQueue, 500); // Delay entre itens
      return () => clearTimeout(timer);
    }
  }, [syncQueue, isSyncing, processSyncQueue]);

  const deleteAula = useDeleteAula(churchId, () => {
    Toast.showSuccess("Aula excluída");
    refetchAulas();
    refetchPendencias();
  });
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
    const aluno = aula.alunos.find(a => a.membroId === membroId);
    const novoStatus = !aluno?.presente;

    // Adiciona à fila de sincronização (LocalStorage)
    setSyncQueue(prev => [
      ...prev,
      {
        aulaId: aula.id,
        membroId,
        presente: novoStatus,
        studentData: aluno,
        timestamp: Date.now()
      }
    ]);

    // Feedback visual imediato (Optimistic Update)
    if (novoStatus && aluno) {
      setLastMarkedName(aluno.nome);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1200);
    }
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
      let studentData: any;
      try {
        studentData = JSON.parse(decodedText);
      } catch {
        Toast.showError("QR Code Inválido: Não pertence à aplicação");
        return;
      }

      const studentId = studentData._id || studentData.id;
      const studentNome = studentData.nome;

      if (!studentId || !studentNome) {
        Toast.showError("QR Code Desconhecido: Dados incompatíveis");
        return;
      }

      let aluno = currentAulaForScan.alunos.find((a) => a.membroId === studentId);

      // Verifica se já está na fila de sincronização para evitar duplicidade rápida
      const isAlreadyInQueue = syncQueue.some(item => item.membroId === studentId && item.aulaId === currentAulaForScan.id);

      if (aluno?.presente || isAlreadyInQueue) {
        Toast.showSuccess(`${capitalizeWords(studentNome)} já está presente ou sendo sincronizado`);
        return;
      }

      // Preparar dados do aluno (especialmente se for reposição)
      const alunoData = aluno || {
        membroId: studentId,
        nome: studentNome,
        rede: studentData.rede || { name: "Reposição/Visitante", _id: "" },
        presente: true
      };

      // Adicionar à fila do LocalStorage
      setSyncQueue(prev => [
        ...prev,
        {
          aulaId: currentAulaForScan.id,
          membroId: studentId,
          presente: true,
          studentData: alunoData,
          timestamp: Date.now()
        }
      ]);

      // Atualização Otimista do estado visual da aula atual
      const updated = {
        ...currentAulaForScan,
        alunos: aluno
          ? currentAulaForScan.alunos.map((a) => a.membroId === studentId ? { ...a, presente: true } : a)
          : [alunoData, ...currentAulaForScan.alunos]
      };

      setCurrentAulaForScan(updated);
      Toast.showSuccess(`${aluno ? "Presença registrada" : "Adicionado para reposição"}: ${capitalizeWords(studentNome)}`);
    } catch (error) {
      console.error("Erro ao processar scan:", error);
      Toast.showError("Erro na leitura");
    }
  };

  const totalPresentes = (aula: AulaDiscipulado) => aula.alunos.filter((a) => a.presente).length;
  const totalAusentes = (aula: AulaDiscipulado) => aula.alunos.filter((a) => !a.presente).length;

  const aulasFiltradas = (aulas || [])
    .filter((aula) =>
      aula.tema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.ministrador?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.alunos.some(aluno => aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="min-h-screen bg-background text-foreground mt-6">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary shrink-0" />
            <h1 className="text-lg font-bold truncate">Discipulado</h1>
          </div>

          {/* Status de Sincronização */}
          {syncQueue.length > 0 && (
            <Badge
              variant="outline"
              className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-1 animate-in fade-in slide-in-from-top-1",
                isSyncing ? "border-primary/50 bg-primary/5 text-primary" : "border-amber-500/50 bg-amber-500/5 text-amber-600"
              )}
            >
              {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <CloudOff className="h-3 w-3" />}
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {isSyncing ? `Sincronizando ${syncQueue.length}...` : `${syncQueue.length} pendentes`}
              </span>
            </Badge>
          )}

          <div className="flex items-center gap-3">
            <Dialog open={openNovoCiclo} onOpenChange={setOpenNovoCiclo}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 sm:px-4">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Novo Semestre</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-2xl sm:rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Novo Semestre</DialogTitle>
                  <DialogDescription>
                    O semestre ativo receberá as matrículas dos alunos e as novas aulas.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-6">
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">Nome do Semestre *</Label>
                    <Input
                      placeholder="Ex: 1º Semestre 2026"
                      value={novoCicloNome}
                      onChange={(e) => setNovoCicloNome(e.target.value)}
                      className="h-11 bg-muted/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-semibold text-sm">Data de Início *</Label>
                      <Input
                        type="date"
                        value={novoCicloInicio}
                        onChange={(e) => setNovoCicloInicio(e.target.value)}
                        className="h-11 bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-sm">Data de Fim *</Label>
                      <Input
                        type="date"
                        value={novoCicloFim}
                        onChange={(e) => setNovoCicloFim(e.target.value)}
                        className="h-11 bg-muted/50"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                  <Button variant="ghost" onClick={() => setOpenNovoCiclo(false)} className="w-full sm:w-auto h-11 sm:h-10">
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCiclo} disabled={createCiclo.isLoading} className="w-full sm:w-auto h-11 sm:h-10 shadow-lg shadow-primary/20">
                    {createCiclo.isLoading ? "Salvando..." : "Criar Semestre"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              size="sm"
              onClick={() => router.push(`/app/${churchId}/secretary/discipulado/novaAula`)}
              className="gap-2 sm:px-4"
              disabled={!cicloAtivo}
              title={!cicloAtivo ? "Crie um semestre primeiro" : ""}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Aula</span>
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
                <Label className="text-xs font-bold mb-1.5 block opacity-70">Pesquisar na Lista</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por tema, ministro ou aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-card shadow-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <Label className="text-xs font-bold mb-1.5 block opacity-70">Filtrar por Semestre</Label>
                <Select value={selectedCiclo} onValueChange={setSelectedCiclo}>
                  <SelectTrigger className="bg-card shadow-sm border-primary/20">
                    <SelectValue placeholder="Escolha o semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {(ciclos || []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome} {c.ativo && " (Ativo)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pendencias" className="border rounded-xl bg-destructive/5 overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      <h2 className="font-bold text-base">Alunos com pendência de reposição ({pendencias?.length})</h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="bg-card rounded-lg border border-destructive/20 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-bold">Aluno</TableHead>
                            <TableHead className="font-bold">Célula</TableHead>
                            <TableHead className="font-bold">Aulas pendentes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(pendencias || []).map((p) => (
                            <TableRow key={p.membroId} className="hover:bg-destructive/5 transition-colors">
                              <TableCell className="font-medium">{p.nome}</TableCell>
                              <TableCell className="text-muted-foreground">{p.rede.name}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {p.aulasPendentes.map((tema) => (
                                    <Badge key={tema} variant="destructive" className="text-[10px] px-1.5 py-0 uppercase font-black">
                                      {tema}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                                  disabled={deleteAula.isLoading}
                                >
                                  {deleteAula.isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4.5 w-4.5" />
                                  )}
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
                            <TableHead className="w-[40px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...aula.alunos]
                            .sort((a, b) => a.nome.localeCompare(b.nome))
                            .map((aluno) => {
                              const isPending = syncQueue.some(item => item.membroId === aluno.membroId && item.aulaId === aula.id);
                              return (
                                <TableRow key={aluno.membroId} className={cn(isPending && "opacity-60 bg-muted/30")}>
                                  <TableCell className="font-medium">{capitalizeWords(aluno.nome)}</TableCell>
                                  <TableCell className="text-muted-foreground">{aluno.rede.name}</TableCell>
                                  <TableCell className="text-center">
                                    <Checkbox
                                      checked={aluno.presente || isPending}
                                      onCheckedChange={() => handleTogglePresenca(aula, aluno.membroId)}
                                      disabled={updatePresenca.isLoading || isPending}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {isPending && (
                                      <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
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

      {/* Modal de Sucesso - Presença Manual */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-[300px] border-none bg-transparent shadow-none flex flex-col items-center justify-center p-0 outline-none">
          <div className="bg-card/90 backdrop-blur-xl border border-primary/20 p-8 rounded-3xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
              <CheckCircle2 className="h-12 w-12 text-primary animate-bounce" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-foreground">Presença!</h3>
              <p className="text-sm text-muted-foreground font-medium truncate max-w-[200px]">
                {capitalizeWords(lastMarkedName)}
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Registrada com sucesso
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discipulado;