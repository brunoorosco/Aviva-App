"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import {
  TVisitorBySource,
  TVisitorCountResponse,
  TVisitorSource,
} from "@/domain/models/visitantes";
import { cn } from "@/lib/utils";

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function VisitorsAnalytics() {
  const [periodView, setPeriodView] = useState<"monthly" | "annual">("monthly");
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;

  const sourceColors: Record<TVisitorSource, string> = {
    invited: "rgb(52, 211, 153)",
    instagram: "rgb(192, 132, 252)",
    facebook: "rgb(96, 165, 250)",
    youtube: "rgb(248, 113, 113)",
    outros: "rgb(156, 163, 175)",
  };

  const { data: visitors, isLoading } = useHttpGet<TVisitorCountResponse>(
    `/api/protected/churches/${churchId}/boas-vindas/analytics`
  );

  // Formata o retorno da API (mensal)
  const formattedVisitors = useMemo(() => {
    if (!visitors?.data?.monthly) return [];
    return visitors.data.monthly.map((item) => ({
      monthYear: item.monthYear,
      count: item.totalItems,
      year: item.monthYear.split("-")[0],
      month: item.monthYear.split("-")[1],
    }));
  }, [visitors]);

  // Total geral
  const totalVisitors = formattedVisitors.reduce((sum, item) => sum + item.count, 0);

  // Último mês
  const lastMonth = formattedVisitors.at(-1);

  // Agrupa por ano para exibição anual
  const annualVisitors = useMemo(() => {
    const byYear: Record<string, number> = {};
    formattedVisitors.forEach((item) => {
      byYear[item.year] = (byYear[item.year] || 0) + item.count;
    });
    return Object.entries(byYear).map(([year, count]) => ({ year, count }));
  }, [formattedVisitors]);

  // Fonte principal (maior contagem)
  const mainSource = useMemo(() => {
    const sources = visitors?.data?.bySource;
    if (!sources || sources.length === 0) return null;
    return sources.reduce((prev, curr) => (curr.count > prev.count ? curr : prev));
  }, [visitors]);

  // Configuração do gráfico de barras
  const barChartData = {
    labels:
      periodView === "monthly"
        ? formattedVisitors.map((v) => v.monthYear)
        : annualVisitors.map((v) => v.year),
    datasets: [
      {
        label: "Visitantes",
        data:
          periodView === "monthly"
            ? formattedVisitors.map((v) => v.count)
            : annualVisitors.map((v) => v.count),
        backgroundColor: "rgb(00, 51, 204)",
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "hsl(100,50%,50%)", //balão de mensagem
        titleColor: "hsl(275,90%,100%)", //color dotitulo do balão
        bodyColor: "hsl(275,90%,100%)", //color do texto do balão
        borderColor: "rgba(0,0,0,0.05)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0, 0, 0, 0.02)", display: false },
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
      },
      y: {
        grid: {
          color: "hsl(var(--border))",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
      },
    },
  };

  // Configuração do gráfico de pizza
  const pieChartData = {
    labels: (visitors?.data?.bySource || []).map((item) => item.source),
    datasets: [
      {
        data: (visitors?.data?.bySource || []).map((item) => item.count),
        backgroundColor: (visitors?.data?.bySource || []).map(
          (item) => sourceColors[item.source] || "gray"
        ),
        borderWidth: 0,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "hsl(var(--background))",
        titleColor: "hsl(var(--foreground))",
        bodyColor: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(0);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const todayLabel = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }, []);

  const mounthyLabel = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("pt-BR", {
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4">
        <div className="grid gap-4 mb-8 md:grid-cols-3 grid-cols-1 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total de Visitantes</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisitors}</div>
              <p className="text-xs text-muted-foreground">Todas as fontes combinadas</p>
            </CardContent>
          </Card>

          <div className="flex gap-4 w-full">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Visitantes Este Mês</CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lastMonth?.count || 0}</div>
                <p className="text-xs text-muted-foreground">{mounthyLabel}</p>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Visitantes Hoje</CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{visitors?.data.visitorsToday}</div>
                <p className="text-xs text-muted-foreground">{todayLabel}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Fonte Principal</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{mainSource?.source || "—"}</div>
              <p className="text-xs text-muted-foreground">{mainSource?.count || 0} visitantes</p>
            </CardContent>
          </Card>
        </div>

        {/* Visitors Over Time Chart */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Visitantes</CardTitle>
                <CardDescription>Visualize os visitantes por período</CardDescription>
              </div>
              <Tabs
                value={periodView}
                onValueChange={(v) => setPeriodView(v as "monthly" | "annual")}
              >
                <TabsList>
                  <TabsTrigger value="monthly">Mensal</TabsTrigger>
                  <TabsTrigger value="annual">Anual</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Visitors by Source Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visitantes por Origem</CardTitle>
            <CardDescription>Distribuição de visitantes por fonte de origem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="h-[400px] w-full">
                <Doughnut data={pieChartData} options={pieChartOptions} />
              </div>

              <div className="space-y-4">
                {(visitors?.data?.bySource || []).map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: sourceColors[item.source] || "gray",
                        }}
                      />
                      <span className="font-medium capitalize">
                        {item.source === "invited" ? "Convidado" : item.source}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.count}</div>
                      <div className="text-xs text-muted-foreground">
                        {totalVisitors > 0 ? ((item.count / totalVisitors) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
