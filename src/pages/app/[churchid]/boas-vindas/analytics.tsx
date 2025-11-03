"use client";

import * as React from "react";
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
} from "recharts";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import {
  TVisitorBySource,
  TVisitorCountResponse,
  TVisitorSource,
} from "@/domain/models/visitantes";

export default function VisitorsAnalytics() {
  const [periodView, setPeriodView] = useState<"monthly" | "annual">("monthly");
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;

  const chartConfig = {
    count: {
      label: "Visitantes",
      color: "hsl(var(--primary))",
    },
  };

  const sourceColors: Record<TVisitorSource, string> = {
    invited: "hsl(150, 70%, 50%)",
    instagram: "hsl(280, 70%, 50%)",
    facebook: "hsl(210, 70%, 50%)",
    youtube: "hsl(0, 70%, 50%)",
    outros: "hsl(var(--muted-foreground))",
  };

  const { data: visitors, isLoading } = useHttpGet<TVisitorCountResponse>(
    `/api/protected/churches/${churchId}/boas-vindas/analytics`
  );

  // 🔹 Formata o retorno da API (mensal)
  const formattedVisitors = useMemo(() => {
    if (!visitors?.data?.monthly) return [];
    return visitors.data.monthly.map((item) => ({
      monthYear: item.monthYear,
      count: item.totalItems,
      year: item.monthYear.split("-")[0],
      month: item.monthYear.split("-")[1],
    }));
  }, [visitors]);

  // 🔹 Total geral
  const totalVisitors = formattedVisitors.reduce((sum, item) => sum + item.count, 0);

  // 🔹 Último mês
  const lastMonth = formattedVisitors.at(-1);

  // 🔹 Agrupa por ano para exibição anual
  const annualVisitors = useMemo(() => {
    const byYear: Record<string, number> = {};
    formattedVisitors.forEach((item) => {
      byYear[item.year] = (byYear[item.year] || 0) + item.count;
    });
    return Object.entries(byYear).map(([year, count]) => ({ year, count }));
  }, [formattedVisitors]);

  // 🔹 Fonte principal (maior contagem)
  const mainSource = useMemo(() => {
    const sources = visitors?.data?.bySource;
    if (!sources || sources.length === 0) return null;
    return sources.reduce((prev, curr) => (curr.count > prev.count ? curr : prev));
  }, [visitors]);

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
              <div className="text-2xl font-bold">{lastMonth?.count || 0}</div>
              <p className="text-xs text-muted-foreground">{lastMonth?.monthYear || ""}</p>
            </CardContent>
          </Card>

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
            <div className="h-[400px] w-full">
              {/* @ts-expect-error - Recharts typing issue with React versions */}
              <ResponsiveContainer width="100%" height="100%">
                {/* @ts-expect-error - Recharts typing issue */}
                <BarChart data={periodView === "monthly" ? formattedVisitors : annualVisitors}>
                  {/* @ts-expect-error - Recharts typing issue */}
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  {/* @ts-expect-error - Recharts typing issue */}
                  <XAxis
                    dataKey={periodView === "monthly" ? "monthYear" : "year"}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  {/* @ts-expect-error - Recharts typing issue */}
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  {/* @ts-expect-error - Recharts typing issue */}
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {/* @ts-expect-error - Recharts typing issue */}
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                {/* @ts-expect-error - Recharts typing issue */}
                <ResponsiveContainer width="100%" height="100%">
                  {/* @ts-expect-error - Recharts typing issue */}
                  <PieChart>
                    {/* @ts-expect-error - Recharts typing issue */}
                    <Pie
                      data={visitors?.data?.bySource || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percent }) =>
                        `${source}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={120}
                      fill="hsl(var(--primary))"
                      dataKey="count"
                    >
                      {(visitors?.data?.bySource || []).map((entry) => (
                        <Cell
                          key={`cell-${entry.source}`}
                          fill={sourceColors[entry.source] || "gray"}
                        />
                      ))}
                    </Pie>
                    {/* @ts-expect-error - Recharts typing issue */}
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const { source, count } = payload[0].payload as TVisitorBySource;
                          return (
                            <div className="p-2 border rounded-lg shadow-sm bg-background">
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm font-medium capitalize">{source}:</span>
                                <span className="text-sm font-bold">{count}</span>
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
                {(visitors?.data?.bySource || []).map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: sourceColors[item.source] || "gray",
                        }}
                      />
                      <span className="font-medium capitalize">{item.source}</span>
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