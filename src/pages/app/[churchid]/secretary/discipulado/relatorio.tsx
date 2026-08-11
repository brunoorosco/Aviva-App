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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard icon={<CalendarDays className="h-6 w-6" />} label="Aulas" value={String(relatorio.totalAulas)} color="text-primary" bg="bg-primary/10" />
              <StatCard icon={<Users className="h-6 w-6" />} label="Matriculados" value={String(relatorio.totalMatriculados)} color="text-sky-600" bg="bg-sky-500/10" />
              <StatCard icon={<CheckCircle2 className="h-6 w-6" />} label="Aprovados" value={String(relatorio.aprovados)} color="text-green-600" bg="bg-green-500/10" />
              <StatCard icon={<XCircle className="h-6 w-6" />} label="Reprovados" value={String(relatorio.reprovados)} color="text-destructive" bg="bg-destructive/10" />
              <StatCard icon={<BarChart3 className="h-6 w-6" />} label="Aprovação" value={`${relatorio.percentualAprovacao}%`} color="text-primary" bg="bg-primary/10" />
              <StatCard icon={<BookOpen className="h-6 w-6" />} label="Presença média" value={`${relatorio.presencaMedia}%`} color="text-amber-600" bg="bg-amber-500/10" />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Presença por Aula</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {relatorio.aulas.length > 0 ? (
                    <Bar
                      data={presencaPorAulaChart}
                      options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }}
                    />
                  ) : (
                    <EmptyChart />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Frequência média por Aula (%)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {relatorio.aulas.length > 0 ? (
                    <Line
                      data={frequenciaChart}
                      options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }}
                    />
                  ) : (
                    <EmptyChart />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Aprovação</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {relatorio.totalMatriculados > 0 ? (
                    <Doughnut
                      data={aprovacaoChart}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  ) : (
                    <EmptyChart />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Distribuição por Rede</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {relatorio.porRede.length > 0 ? (
                    <Doughnut
                      data={porRedeChart}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  ) : (
                    <EmptyChart />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Ranking por Rede */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">Ranking por Rede</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {relatorio.porRede.map((r, i) => (
                  <div key={r.rede} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm w-6 text-muted-foreground">#{i + 1}</span>
                      <span className="font-semibold">{r.rede}</span>
                      <Badge variant="outline" className="text-[10px]">{r.total} alunos</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-green-600">{r.aprovados} aprov.</span>
                      <span className="font-bold text-destructive">{r.reprovados} reprov.</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tabela de Alunos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Alunos ({relatorio.alunos.length})</CardTitle>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Rede</TableHead>
                        <TableHead className="text-center">Presenças</TableHead>
                        <TableHead className="text-center">Faltas</TableHead>
                        <TableHead className="text-center">Frequência</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...relatorio.alunos]
                        .sort((a, b) => a.nome.localeCompare(b.nome))
                        .map((aluno) => (
                          <TableRow key={aluno.membroId}>
                            <TableCell className="font-medium">{capitalizeWords(aluno.nome)}</TableCell>
                            <TableCell className="text-muted-foreground">{aluno.rede?.name || "-"}</TableCell>
                            <TableCell className="text-center">{aluno.presencas}</TableCell>
                            <TableCell className={cn("text-center font-semibold", aluno.faltas > 3 && "text-destructive")}>
                              {aluno.faltas}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-medium">{aluno.frequencia}%</span>
                                <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full", aluno.frequencia >= 70 ? "bg-green-500" : aluno.frequencia >= 40 ? "bg-amber-500" : "bg-destructive")}
                                    style={{ width: `${Math.min(aluno.frequencia, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                className={aluno.status === "aprovado" ? "bg-green-600 hover:bg-green-600 border-transparent" : "bg-red-600 hover:bg-red-600 border-transparent"}
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Aulas ({relatorio.aulas.length})</CardTitle>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tema</TableHead>
                        <TableHead>Ministrador</TableHead>
                        <TableHead className="text-center">Presentes</TableHead>
                        <TableHead className="text-center">Ausentes</TableHead>
                        <TableHead className="text-center">Frequência</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorio.aulas
                        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                        .map((aula) => {
                          const total = aula.presentes + aula.ausentes;
                          const pct = total > 0 ? Math.round((aula.presentes / total) * 100) : 0;
                          return (
                            <TableRow key={aula.id}>
                              <TableCell>{format(new Date(aula.data), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                              <TableCell className="font-medium">{aula.tema}</TableCell>
                              <TableCell className="text-muted-foreground">{aula.ministrador?.nome || "-"}</TableCell>
                              <TableCell className="text-center font-medium text-green-600">{aula.presentes}</TableCell>
                              <TableCell className="text-center text-destructive">{aula.ausentes}</TableCell>
                              <TableCell className="text-center">{pct}%</TableCell>
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
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn("rounded-xl p-2.5", bg, color)}>{icon}</div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold leading-tight truncate">{value}</p>
          <p className="text-xs text-muted-foreground truncate">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
      Sem dados para exibir.
    </div>
  );
}

export default DiscipuladoRelatorio;
