import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend,
} from "recharts";
import {
  mockAnnualVisitors,
  mockMonthlyVisitors,
  mockVisitorsBySource,
} from "@/mocks/mockVisitors";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";

export default function VisitorsAnalytics() {
  const [periodView, setPeriodView] = useState<"monthly" | "annual">("monthly");
  const { data: session } = useSession();
  const churchId = session?.user.churchId;

  const chartConfig = {
    count: {
      label: "Visitantes",
      color: "hsl(var(--primary))",
    },
  };

  const sourceColors = {
    invinted: "hsl(var(--primary))",
    instagram: "hsl(280, 70%, 50%)",
    facebook: "hsl(210, 70%, 50%)",
    youtube: "hsl(0, 70%, 50%)",
    outros: "hsl(var(--muted-foreground))",
  };

  const {
    data: visitors,
    isLoading,
    mutate,
  } = useHttpGet(`/api/protected/churches/${churchId}/boas-vindas/analytics`);

  const formattedVisitors = useMemo(() => {
    if (!visitors?.data) return [];
    return visitors.data.map((item: any) => ({
      monthYear: item.monthYear,
      totalItems: item.totalItems,
    }));
  }, [visitors]);

  // 🔹 Total geral
  const totalVisitors = formattedVisitors.reduce((sum: any, item: any) => sum + item.totalItems, 0);
  // 🔹 Último mês
  const lastMonth = formattedVisitors.at(-1);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/app">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Análise de Visitantes</h1>
                <p className="text-sm text-muted-foreground">
                  Acompanhe os visitantes e suas origens
                </p>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 mx-auto">
        {/* Summary Cards */}
        <div className="grid gap-4 mb-8 md:grid-cols-3">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Visitantes Este Mês</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastMonth?.totalItems || 0}</div>
              <p className="text-xs text-muted-foreground">{lastMonth?.monthYear || ""}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Fonte Principal</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {mockVisitorsBySource[0]?.source || ""}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockVisitorsBySource[0]?.count || 0} visitantes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visitors Over Time Chart */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Visitantes ao Longo do Tempo</CardTitle>
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
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={periodView === "monthly" ? mockMonthlyVisitors : mockAnnualVisitors}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey={periodView === "monthly" ? "month" : "year"}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
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
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockVisitorsBySource}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="hsl(var(--primary))"
                      dataKey="count"
                    >
                      {mockVisitorsBySource.map((entry) => (
                        <Cell key={`cell-${entry.source}`} fill={sourceColors[entry.source]} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="p-2 border rounded-lg shadow-sm bg-background">
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm font-medium capitalize">
                                  {payload[0].payload.source}:
                                </span>
                                <span className="text-sm font-bold">{payload[0].value}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {mockVisitorsBySource.map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: sourceColors[item.source] }}
                      />
                      <span className="font-medium capitalize">{item.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.count}</div>
                      <div className="text-xs text-muted-foreground">
                        {((item.count / totalVisitors) * 100).toFixed(1)}%
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
