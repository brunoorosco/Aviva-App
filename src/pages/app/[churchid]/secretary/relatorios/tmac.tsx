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
    ChartOptions,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Calendar, Users, Church, Network, Star, Loader2, ArrowLeft } from "lucide-react";
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

// Types matching the API response
interface StatItem {
    _id: string; // Rede Name or Church Name
    total: number;
}

interface EncontroSummary {
    numero: string;
    data: string;
    totalParticipantes: number;
}

interface DashboardData {
    totalAnual: number;
    totaisPorRede: StatItem[];
    totaisPorIgreja: StatItem[];
    encontros: EncontroSummary[];
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function TmacReport() {
    const { data: session } = useSession();
    // Helper to safely access extended user properties
    const user = session?.user as any;
    const churchId = user?.churchId;
    const userRede = user?.rede || user?.redeId;

    const [year, setYear] = useState(new Date().getFullYear().toString());

    const { data: reportData, isLoading } = useHttpGet<DashboardData>(
        churchId ? `/api/protected/churches/${churchId}/secretary/tmac-report?year=${year}` : null
    );

    const data = reportData?.data || {
        totalAnual: 0,
        totaisPorRede: [],
        totaisPorIgreja: [],
        encontros: [],
    };

    // Find user's network stats
    const myNetworkStats = useMemo(() => {
        if (!userRede) return null;
        // Normalized comparison
        return data.totaisPorRede.find(
            (r) =>
                r._id.toLowerCase().includes(userRede.toLowerCase()) ||
                userRede.toLowerCase().includes(r._id.toLowerCase())
        );
    }, [data, userRede]);

    // Chart Data
    const barChartData: ChartData<"bar"> = useMemo(
        () => ({
            labels: (data.encontros || []).map((e) => `Enc. ${e.numero}`),
            datasets: [
                {
                    label: "Participantes",
                    data: (data.encontros || []).map((e) => e.totalParticipantes),
                    backgroundColor: "#3b82f6",
                    borderRadius: 4,
                },
            ],
        }),
        [data]
    );

    const doughnutChartData: ChartData<"doughnut"> = useMemo(
        () => ({
            labels: (data.totaisPorRede || []).map((r) => r._id),
            datasets: [
                {
                    label: "Participantes",
                    data: (data.totaisPorRede || []).map((r) => r.total),
                    backgroundColor: [
                        "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
                        "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6",
                    ],
                    borderWidth: 1,
                },
            ],
        }),
        [data]
    );

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
                            Indicadores de Encontros e Fechamento
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

            {/* HIGHLIGHT CARD FOR USER NETWORK */}
            {userRede && (
                <div className="mb-8">
                    <Card className={`border-l-4 ${myNetworkStats ? 'border-l-purple-600' : 'border-l-gray-300'} shadow-md`}>
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
                </div>
            )}

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Anual</p>
                            <p className="text-3xl font-bold">{data.totalAnual}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Encontros Realizados</p>
                            <p className="text-3xl font-bold">{data.encontros.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                            <Church className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Igrejas Participantes</p>
                            <p className="text-3xl font-bold">{data.totaisPorIgreja.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Evolução por Encontro</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Distribuição por Rede</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </CardContent>
                </Card>
            </div>

            {/* PREVIEW TABLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="text-sm uppercase tracking-wide text-slate-500">Ranking das Redes</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.totaisPorRede.map((rede, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm w-6 text-slate-400">#{i + 1}</span>
                                        <span className="font-semibold text-slate-700">{rede._id}</span>
                                    </div>
                                    <div className="font-bold text-slate-900">{rede.total}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-sm uppercase tracking-wide text-slate-500">Igrejas</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {data.totaisPorIgreja.map((igreja, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <span className="font-medium text-slate-700">{igreja._id}</span>
                                    <div className="font-bold text-slate-900">{igreja.total}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
