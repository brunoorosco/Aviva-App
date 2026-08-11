import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  ArrowLeft,
  BookOpen,
  Users,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Loader2,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  useCiclos,
  useRelatorioCiclo,
} from "@/hooks/useDiscipulado";
import { capitalizeWords } from "@/utils/capitalizaFirst";
import ExportButton from "@/components/ExportButton";
import { cn } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const CHART_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"];

const DiscipuladoRelatorio = () => {
  const router = useRouter();
  const { query } = router;
  const churchId = query.churchid as string | undefined;

  const [selectedCiclo, setSelectedCiclo] = useState<string>(
    typeof query.cicloId === "string" ? query.cicloId : "",
  );

  const { data: ciclos = [] } = useCiclos(churchId);
  const { data: relatorio, isLoading } = useRelatorioCiclo(churchId, selectedCiclo || undefined);

  const cicloAtivo = ciclos?.find((c) => c.ativo) || ciclos?.[0];
  if (!selectedCiclo && cicloAtivo) {
    setSelectedCiclo(cicloAtivo.id);
  }

  const presencaPorAulaChart: any = useMemo(() => {
    const aulas = relatorio?.aulas || [];
    return {
      labels: aulas.map((a) => format(new Date(a.data), "dd MMM", { locale: ptBR })),
      datasets: [
        {
          label: "Presentes",
          data: aulas.map((a) => a.presentes),
          backgroundColor: "#10b981",
          borderRadius: 4,
        },
        {
          label: "Ausentes",
          data: aulas.map((a) => a.ausentes),
          backgroundColor: "#ef4444",
          borderRadius: 4,
        },
      ],
    };
  }, [relatorio]);

  const aprovacaoChart: any = useMemo(() => ({
    labels: ["Aprovados", "Reprovados"],
    datasets: [
      {
        label: "Alunos",
        data: [relatorio?.aprovados || 0, relatorio?.reprovados || 0],
        backgroundColor: ["#10b981", "#ef4444"],
        borderWidth: 1,
      },
    ],
  }), [relatorio]);

  const porRedeChart: any = useMemo(() => {
    const redes = relatorio?.porRede || [];
    return {
      labels: redes.map((r) => r.rede),
      datasets: [
        {
          label: "Alunos",
          data: redes.map((r) => r.total),
          backgroundColor: CHART_COLORS,
          borderWidth: 1,
        },
      ],
    };
  }, [relatorio]);

  const frequenciaChart: any = useMemo(() => {
    const aulas = relatorio?.aulas || [];
    return {
      labels: aulas.map((a) => format(new Date(a.data), "dd MMM", { locale: ptBR })),
      datasets: [
        {
          label: "Frequência média (%)",
          data: aulas.map((a) =>
            (relatorio?.totalMatriculados || 0) > 0
              ? Math.round((a.presentes / relatorio!.totalMatriculados) * 100)
              : 0,
          ),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [relatorio]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground mt-6">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/app/${churchId}/secretary/discipulado`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <BarChart3 className="h-5 w-5 text-primary shrink-0" />
              <h1 className="text-lg font-bold truncate">Relatório do Discipulado</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedCiclo} onValueChange={setSelectedCiclo}>
              <SelectTrigger className="w-[200px] bg-card shadow-sm border-primary/20">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {!selectedCiclo ? (
          <Card>
            <CardContent className="text-center py-16 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Nenhum semestre encontrado.</p>
              <p className="text-sm mt-1">Crie um semestre na página do Discipulado para gerar o relatório.</p>
            </CardContent>
          </Card>
        ) : !relatorio ? (
          <Card>
            <CardContent className="text-center py-16 text-muted-foreground">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Nenhum dado encontrado para este ciclo.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cards Resumo */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Aulas" value={String(relatorio.totalAulas)} color="text-primary" bg="bg-primary/10" />
              <StatCard icon={<Users className="h-5 w-5" />} label="Matriculados" value={String(relatorio.totalMatriculados)} color="text-sky-600" bg="bg-sky-500/10" />
              <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Aprovados" value={String(relatorio.aprovados)} color="text-green-600" bg="bg-green-500/10" />
              <StatCard icon={<XCircle className="h-5 w-5" />} label="Reprovados" value={String(relatorio.reprovados)} color="text-destructive" bg="bg-destructive/10" />
              <StatCard icon={<BarChart3 className="h-5 w-5" />} label="Aprovação" value={`${relatorio.percentualAprovacao}%`} color="text-primary" bg="bg-primary/10" />
              <StatCard icon={<BookOpen className="h-5 w-5" />} label="Presença média" value={`${relatorio.presencaMedia}%`} color="text-amber-600" bg="bg-amber-500/10" />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 bg-muted/30">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Presença por Aula
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] pt-4">
                  {relatorio.aulas.length > 0 ? (
                    <Bar
                      data={presencaPorAulaChart}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 15 } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } } } }}
                    />
                  ) : (
                    <EmptyChart />
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-2 bg-muted/30">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Frequência média por Aula (%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] pt-4">
                  {relatorio.aulas.length > 0 ? (
                    <Line
                      data={frequenciaChart}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 15 } } }, scales: { y: { beginAtZero: true, max: 100, grid: { color: "rgba(0,0,0,0.05)" } }, x: { grid: { display: false } } } }}
                    />
                  ) : (
                    <EmptyChart />
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-2 bg-muted/30">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Aprovação
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] pt-4 flex items-center justify-center">
                  {relatorio.totalMatriculados > 0 ? (
                    <div className="relative w-full h-full max-w-[200px]">
                      <Doughnut
                        data={aprovacaoChart}
                        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 15 } } }, cutout: "65%" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-2xl font-black text-primary">{relatorio.percentualAprovacao}%</span>
                        <span className="text-[10px] text-muted-foreground font-medium">Aprovação</span>
                      </div>
                    </div>
                  ) : (
                    <EmptyChart />
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-2 bg-muted/30">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Distribuição por Rede
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] pt-4">
                  {relatorio.porRede.length > 0 ? (
                    <Doughnut
                      data={porRedeChart}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 15 } } }, cutout: "50%" }}
                    />
                  ) : (
                    <EmptyChart />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Ranking por Rede */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3 bg-muted/30">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Ranking por Rede
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {relatorio.porRede.map((r, i) => (
                  <div key={r.rede} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                        i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"
                      )}>
                        {i + 1}
                      </div>
                      <div>
                        <span className="font-bold text-sm">{r.rede}</span>
                        <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0">{r.total} alunos</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        <span className="font-bold text-green-600">{r.aprovados}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5 text-destructive" />
                        <span className="font-bold text-destructive">{r.reprovados}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tabela de Alunos */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/30">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Alunos ({relatorio.alunos.length})
                </CardTitle>
                <ExportButton
                  items={relatorio.alunos}
                  filename={`discipulado-alunos-${relatorio.ciclo.nome.replace(/\s+/g, "-").toLowerCase()}.xlsx`}
                  sheetName="Alunos"
                  mapExport={(aluno) => ({
                    Aluno: capitalizeWords(aluno.nome),
                    Rede: aluno.rede?.name || "-",
                    "Aulas do ciclo": aluno.totalAulas,
                    Presencas: aluno.presencas,
                    Faltas: aluno.faltas,
                    "Frequencia (%)": aluno.frequencia,
                    Status: aluno.status === "aprovado" ? "Aprovado" : "Reprovado",
                  })}
                />
              </CardHeader>
              <CardContent className="p-0">
                {/* Mobile Card View */}
                <div className="md:hidden divide-y">
                  {[...relatorio.alunos]
                    .sort((a, b) => a.nome.localeCompare(b.nome))
                    .map((aluno) => (
                      <div key={aluno.membroId} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm truncate">{capitalizeWords(aluno.nome)}</p>
                            <p className="text-xs text-muted-foreground">{aluno.rede?.name || "-"}</p>
                          </div>
                          <Badge
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 shrink-0 ml-2",
                              aluno.status === "aprovado" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
                            )}
                          >
                            {aluno.status === "aprovado" ? "Aprovado" : "Reprovado"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-muted/50 rounded-lg">
                            <p className="text-lg font-black text-green-600">{aluno.presencas}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">Presenças</p>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded-lg">
                            <p className={cn("text-lg font-black", aluno.faltas > 3 ? "text-destructive" : "text-muted-foreground")}>{aluno.faltas}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">Faltas</p>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded-lg">
                            <p className={cn("text-lg font-black", aluno.frequencia >= 70 ? "text-green-600" : aluno.frequencia >= 40 ? "text-amber-600" : "text-destructive")}>{aluno.frequencia}%</p>
                            <p className="text-[10px] text-muted-foreground font-medium">Frequência</p>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-500", aluno.frequencia >= 70 ? "bg-green-500" : aluno.frequencia >= 40 ? "bg-amber-500" : "bg-destructive")}
                            style={{ width: `${Math.min(aluno.frequencia, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-bold text-xs uppercase tracking-wider w-[30%]">Aluno</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider w-[15%]">Rede</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-center w-[10%]">Pres.</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-center w-[10%]">Falt.</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-center w-[25%]">Frequência</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-right w-[10%]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...relatorio.alunos]
                        .sort((a, b) => a.nome.localeCompare(b.nome))
                        .map((aluno) => (
                          <TableRow key={aluno.membroId} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-semibold text-sm py-3">{capitalizeWords(aluno.nome)}</TableCell>
                            <TableCell className="text-muted-foreground text-sm py-3">{aluno.rede?.name || "-"}</TableCell>
                            <TableCell className="text-center font-bold text-green-600 text-sm py-3">{aluno.presencas}</TableCell>
                            <TableCell className={cn("text-center font-bold text-sm py-3", aluno.faltas > 3 ? "text-destructive" : "text-muted-foreground")}>
                              {aluno.faltas}
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="flex items-center gap-2">
                                <span className={cn("font-bold text-sm tabular-nums", aluno.frequencia >= 70 ? "text-green-600" : aluno.frequencia >= 40 ? "text-amber-600" : "text-destructive")}>
                                  {aluno.frequencia}%
                                </span>
                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden min-w-[60px]">
                                  <div
                                    className={cn("h-full rounded-full transition-all duration-500", aluno.frequencia >= 70 ? "bg-green-500" : aluno.frequencia >= 40 ? "bg-amber-500" : "bg-destructive")}
                                    style={{ width: `${Math.min(aluno.frequencia, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-3">
                              <Badge
                                className={cn(
                                  "text-[10px] font-bold uppercase px-2 py-0.5",
                                  aluno.status === "aprovado" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" : "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                                )}
                              >
                                {aluno.status === "aprovado" ? "Aprovado" : "Reprovado"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Aulas */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/30">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Aulas ({relatorio.aulas.length})
                </CardTitle>
                <ExportButton
                  items={relatorio.aulas}
                  filename={`discipulado-aulas-${relatorio.ciclo.nome.replace(/\s+/g, "-").toLowerCase()}.xlsx`}
                  sheetName="Aulas"
                  mapExport={(aula) => ({
                    Data: format(new Date(aula.data), "dd/MM/yyyy"),
                    Tema: aula.tema,
                    Ministrador: aula.ministrador?.nome || "-",
                    Presentes: aula.presentes,
                    Ausentes: aula.ausentes,
                  })}
                />
              </CardHeader>
              <CardContent className="p-0">
                {/* Mobile Card View */}
                <div className="md:hidden divide-y">
                  {relatorio.aulas
                    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                    .map((aula) => {
                      const total = aula.presentes + aula.ausentes;
                      const pct = total > 0 ? Math.round((aula.presentes / total) * 100) : 0;
                      return (
                        <div key={aula.id} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-center justify-center bg-primary/10 border border-primary/20 rounded-lg w-12 h-12 shrink-0">
                                <span className="text-[8px] text-primary font-bold uppercase leading-none mb-0.5">
                                  {format(new Date(aula.data), "MMM", { locale: ptBR })}
                                </span>
                                <span className="text-base font-black text-primary leading-none">
                                  {format(new Date(aula.data), "dd")}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm truncate">{aula.tema}</p>
                                <p className="text-xs text-muted-foreground truncate">{aula.ministrador?.nome || "-"}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={cn("text-xs font-bold", pct >= 70 ? "text-green-600 border-green-200" : "text-destructive border-red-200")}>
                              {pct}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <p className="text-lg font-black text-green-600">{aula.presentes}</p>
                              <p className="text-[10px] text-green-700 font-medium">Presentes</p>
                            </div>
                            <div className="text-center p-2 bg-red-50 rounded-lg">
                              <p className="text-lg font-black text-destructive">{aula.ausentes}</p>
                              <p className="text-[10px] text-red-700 font-medium">Ausentes</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-bold text-xs uppercase tracking-wider w-[12%]">Data</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider w-[25%]">Tema</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider w-[25%]">Ministrador</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-center w-[10%]">Presentes</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-center w-[10%]">Ausentes</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-center w-[18%]">Frequência</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorio.aulas
                        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                        .map((aula) => {
                          const total = aula.presentes + aula.ausentes;
                          const pct = total > 0 ? Math.round((aula.presentes / total) * 100) : 0;
                          return (
                            <TableRow key={aula.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="text-sm py-3 font-medium">
                                {format(new Date(aula.data), "dd/MM/yy", { locale: ptBR })}
                              </TableCell>
                              <TableCell className="font-semibold text-sm py-3">{aula.tema}</TableCell>
                              <TableCell className="text-muted-foreground text-sm py-3 truncate max-w-[200px]">{aula.ministrador?.nome || "-"}</TableCell>
                              <TableCell className="text-center font-bold text-green-600 text-sm py-3">{aula.presentes}</TableCell>
                              <TableCell className="text-center font-bold text-destructive text-sm py-3">{aula.ausentes}</TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2 justify-center">
                                  <span className={cn("font-bold text-sm tabular-nums", pct >= 70 ? "text-green-600" : pct >= 40 ? "text-amber-600" : "text-destructive")}>
                                    {pct}%
                                  </span>
                                  <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className={cn("h-full rounded-full transition-all duration-500", pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-destructive")}
                                      style={{ width: `${Math.min(pct, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn("rounded-xl p-2.5 shrink-0", bg, color)}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-black leading-tight truncate tabular-nums">{value}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate font-medium uppercase tracking-wider">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="h-full flex items-center justify-center text-sm text-muted-foreground flex-col gap-2">
      <BarChart3 className="h-8 w-8 opacity-30" />
      <p>Sem dados para exibir.</p>
    </div>
  );
}

export default DiscipuladoRelatorio;
