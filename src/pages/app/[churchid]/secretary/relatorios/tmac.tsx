import React, { useMemo, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    ChartData,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Calendar, Users, Church, Network, Star, Loader2, ArrowLeft, Home, UserCheck, BookOpen } from "lucide-react";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- TYPES ---
interface StatItem {
    _id: string;
    total: number;
}

interface EncontroSummary {
    numero: string;
    data: string;
    totalParticipantes: number;
}

interface EncontroData {
    totalAnual: number;
    totaisPorRede: StatItem[];
    totaisPorIgreja: StatItem[];
    encontros: EncontroSummary[];
}

interface CasasData {
    month: number;
    year: number;
    total: number;
}

interface VisitasData {
    date: string;
    total: number;
}

interface DashboardData {
    encontro: EncontroData;
    casasDePaz: CasasData[];
    visitasDePaz: VisitasData[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function TmacReport() {
    const { data: session } = useSession();
    const user = session?.user as any;
    const churchId = user?.churchId;
    const userRede = user?.rede || user?.redeId;

    const [year, setYear] = useState(new Date().getFullYear().toString());

    const { data: reportData, isLoading } = useHttpGet<DashboardData>(
        churchId ? `/api/protected/churches/${churchId}/secretary/tmac-report?year=${year}` : null
    );

    const data = reportData?.data || {
        encontro: { totalAnual: 0, totaisPorRede: [], totaisPorIgreja: [], encontros: [] },
        casasDePaz: [],
        visitasDePaz: []
    };

    const encontroData = data.encontro;

    // --- ENCONTRO CHARTS ---
    const myNetworkStats = useMemo(() => {
        if (!userRede) return null;
        return encontroData.totaisPorRede?.find(
            (r) =>
                r._id.toLowerCase().includes(userRede.toLowerCase()) ||
                userRede.toLowerCase().includes(r._id.toLowerCase())
        );
    }, [encontroData, userRede]);

    const barChartData: ChartData<"bar"> = useMemo(() => ({
        labels: (encontroData.encontros || []).map((e) => `Enc. ${e.numero}`),
        datasets: [{
            label: "Participantes",
            data: (encontroData.encontros || []).map((e) => e.totalParticipantes),
            backgroundColor: "#3b82f6",
            borderRadius: 4,
        }],
    }), [encontroData]);

    const doughnutChartData: ChartData<"doughnut"> = useMemo(() => ({
        labels: (encontroData.totaisPorRede || []).map((r) => r._id),
        datasets: [{
            label: "Participantes",
            data: (encontroData.totaisPorRede || []).map((r) => r.total),
            backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"],
            borderWidth: 1,
        }],
    }), [encontroData]);

    // --- CASAS DE PAZ CHARTS ---
    const casasChartData: ChartData<"line"> = useMemo(() => {
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        // Initialize all months with 0
        const monthlyData = new Array(12).fill(0);

        data.casasDePaz.forEach(item => {
            if (item.month >= 1 && item.month <= 12) {
                monthlyData[item.month - 1] = item.total;
            }
        });

        return {
            labels: months,
            datasets: [{
                label: `Casas de Paz ${year}`,
                data: monthlyData,
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                tension: 0.3,
                fill: true
            }]
        };
    }, [data.casasDePaz, year]);

    // --- VISITAS DE PAZ CHARTS ---
    const visitasChartData: ChartData<"bar"> = useMemo(() => {
        const sortedData = [...data.visitasDePaz].sort((a, b) => a.date.localeCompare(b.date));

        return {
            labels: sortedData.map(d => new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
            datasets: [{
                label: "Visitas Realizadas",
                data: sortedData.map(d => d.total),
                backgroundColor: "#f59e0b",
                borderRadius: 4
            }]
        }
    }, [data.visitasDePaz]);


    if (isLoading) {
        return (
            <div className="flex bg-slate-50 h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <Link href={`/app/${churchId}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Relatórios TMAC
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Painel Integrado de KPI's
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-[120px] bg-white">
                            <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            <Tabs defaultValue="encontro" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mb-8 bg-white p-1 border">
                    <TabsTrigger value="encontro" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
                        <Calendar className="w-4 h-4 mr-2" /> Encontros
                    </TabsTrigger>
                    <TabsTrigger value="casas" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                        <Home className="w-4 h-4 mr-2" /> Casas de Paz
                    </TabsTrigger>
                    <TabsTrigger value="visitas" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800">
                        <UserCheck className="w-4 h-4 mr-2" /> Visitas
                    </TabsTrigger>
                </TabsList>

                {/* --- TAB: ENCONTRO COM DEUS --- */}
                <TabsContent value="encontro" className="space-y-6">
                    {/* Highlight */}
                    {userRede && (
                        <Card className={`border-l-4 ${myNetworkStats ? 'border-l-purple-600' : 'border-l-gray-300'} shadow-sm`}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Star className={`w-5 h-5 ${myNetworkStats ? 'text-purple-600 fill-purple-600' : 'text-gray-400'}`} />
                                    Minha Rede: {userRede}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {myNetworkStats ? (
                                    <div className="flex items-end gap-2">
                                        <span className="text-4xl font-bold text-slate-800">{myNetworkStats.total}</span>
                                        <span className="text-sm text-slate-500 mb-1">vidas enviadas ao Encontro em {year}</span>
                                    </div>
                                ) : (
                                    <p className="text-slate-500">Nenhum dado encontrado para sua rede neste ano.</p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Users className="w-8 h-8" /></div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Anual</p>
                                    <p className="text-3xl font-bold">{encontroData.totalAnual}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-full text-green-600"><Calendar className="w-8 h-8" /></div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Encontros</p>
                                    <p className="text-3xl font-bold">{encontroData.encontros?.length || 0}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-full text-orange-600"><Church className="w-8 h-8" /></div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Igrejas</p>
                                    <p className="text-3xl font-bold">{encontroData.totaisPorIgreja?.length || 0}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Evolução por Encontro</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-base">Distribuição por Rede</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- TAB: CASAS DE PAZ --- */}
                <TabsContent value="casas" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600"><Home className="w-8 h-8" /></div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total de Casas {year}</p>
                                    <p className="text-3xl font-bold">
                                        {data.casasDePaz.reduce((acc, curr) => acc + curr.total, 0)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Evolução de Casas de Paz (Mensal)</CardTitle></CardHeader>
                        <CardContent className="h-[400px]">
                            <Line data={casasChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB: VISITAS DE PAZ --- */}
                <TabsContent value="visitas" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="p-3 bg-amber-100 rounded-full text-amber-600"><UserCheck className="w-8 h-8" /></div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total de Visitas {year}</p>
                                    <p className="text-3xl font-bold">
                                        {data.visitasDePaz.reduce((acc, curr) => acc + curr.total, 0)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Visitas por Data de Execução</CardTitle></CardHeader>
                        <CardContent className="h-[400px]">
                            <Bar data={visitasChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
