"use client";

import { useMemo, useState } from "react";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useTheme } from "next-themes";
import {
  TVisitorBySource,
  TVisitorCountResponse,
  TVisitorSource,
} from "@/domain/models/visitantes";

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function VisitorsAnalytics() {
  const [periodView, setPeriodView] = useState<"monthly" | "annual">("monthly");
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Cores adaptadas ao tema
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(100,100,100,0.2)";
  const tickColor = isDark ? "#a1a1aa" : "#71717a";
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipText = isDark ? "#fafafa" : "#09090b";
  const tooltipBorder = isDark ? "#3f3f46" : "#e4e4e7";
  const barColor = isDark ? "rgb(99, 179, 237)" : "rgb(0, 51, 204)";

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
        backgroundColor: barColor,
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
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: tickColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: tickColor,
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
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: tooltipBorder,
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
                <div className="text-2xl font-bold">{visitors?.data.visitorsToday || 0}</div>
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