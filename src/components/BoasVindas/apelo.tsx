"use client";

import { useMemo, useState } from "react";
import { 
  Users, Heart, Waves, LayoutDashboard, 
  Filter, TrendingUp, RefreshCcw, CheckCircle2,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar } from "react-chartjs-2";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChurchAnalytics() {
  const { data: session } = useSession();
  const [selectedRede, setSelectedRede] = useState<string>("all");
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  
  const churchId = session?.user.churchId as string;

  // Endpoint ajustado conforme a estrutura de pastas comum
  const { data: analytics, isLoading } = useHttpGet<any>(
    `/api/protected/churches/${churchId}/aceitou/report?rede=${selectedRede}&period=${period}`
  );

  // Mapeamento corrigido para bater com o Service do Backend
  const stats = useMemo(() => {
    const d = analytics?.data;
    return {
      total: d?.total || 0,
      newBelievers: d?.newDecisions || 0,      // Mapeado de stats.countAcceptedTrue
      reconciled: d?.reconciliations || 0,     // Mapeado de stats.countAcceptedFalse
      baptized: d?.baptized || 0,              // baptism === true
      pendingBaptism: d?.pendingBaptism || 0,  // baptism === false
    };
  }, [analytics]);

  // Configuração do Gráfico de Barras com as chaves da timeline
  const chartData = useMemo(() => {
    const timeline = analytics?.data?.timeline;
    return {
      labels: timeline?.labels || [], 
      datasets: [
        {
          label: "Aceitou Jesus",
          data: timeline?.acceptedData || [],
          backgroundColor: "#10b981",
          borderRadius: 4,
        },
        {
          label: "Reconciliações",
          data: timeline?.reconciledData || [],
          backgroundColor: "#f59e0b",
          borderRadius: 4,
        },
      ],
    };
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card text-card-foreground p-4 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <LayoutDashboard className="text-blue-600 w-5 h-5" /> 
            Apelo
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedRede} onValueChange={setSelectedRede}>
            <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="Filtrar por Rede" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Redes</SelectItem>
              {/* Se o seu backend retornar a lista de redes, você pode mapear aqui */}
            </SelectContent>
          </Select>

          <Tabs value={period} onValueChange={(v: any) => setPeriod(v)}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="annual">Anual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Aceitaram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.newBelievers}</div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <Heart className="w-3 h-3 fill-emerald-500" /> Aceitaram a Cristo
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Reconciliaram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.reconciled}</div>
            <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
              <RefreshCcw className="w-3 h-3" /> Voltaram para o Pai
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Já Batizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.baptized}</div>
            <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Vida nas Águas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600 bg-orange-50/30 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-orange-800 tracking-wider">Aguardando Batismo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{stats.pendingBaptism}</div>
            <p className="text-[11px] text-orange-600 font-medium flex items-center gap-1 mt-1">
              <Waves className="w-3 h-3" /> Candidatos ao batismo
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Aceitaram x Recociliaram</CardTitle>
            <CardDescription>Comparativo histórico entre aceitaram e reconciliaram</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <Bar 
              data={chartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                    legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth:6 } } 
                },
                scales: { 
                    x: { stacked: true, grid: { display: false } }, 
                    y: { stacked: true, border: { dash: [4, 4] } } 
                }
              }} 
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-dashed border-2 bg-transparent">
          <CardHeader>
            <CardTitle className="text-base font-bold">Foco no Discipulado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group flex items-center justify-between p-4 bg-white border rounded-xl hover:border-emerald-500 transition-all cursor-pointer">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700">Consolidar Novas Vidas</span>
                <span className="text-[10px] text-slate-400">Total de {stats.newBelievers} almas</span>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="group flex items-center justify-between p-4 bg-white border rounded-xl hover:border-amber-500 transition-all cursor-pointer">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700">Visitar Reconciliados</span>
                <span className="text-[10px] text-slate-400">{stats.reconciled} retornaram recentemente</span>
              </div>
              <RefreshCcw className="w-5 h-5 text-amber-500" />
            </div>

            <div className="group flex items-center justify-between p-4 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all cursor-pointer text-white">
              <div className="flex flex-col">
                <span className="text-sm font-bold italic">Preparar Batismo</span>
                <span className="text-[10px] opacity-80">{stats.pendingBaptism} candidatos aptos</span>
              </div>
              <Waves className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}