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
import { Calendar, Users, Church, Network, Star, Loader2, ArrowLeft, Home, UserCheck, BookOpen, Menu } from "lucide-react";
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
    encontristas: { rede: string; igreja: string }[];
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

interface EscolaData {
    courses: { tema: string; totalAlunos: number; data: string }[];
    totalStudents: number;
    byRede: StatItem[];
    aprovados: number;
    reprovados: number;
}

interface DashboardData {
    encontro: EncontroData;
    reencontro: EncontroData;
    sejaLivre: EncontroData;
    casasDePaz: CasasData[];
    visitasDePaz: VisitasData[];
    escolaProfeta: EscolaData;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

/**
 * Reusable Component for Encounter-like Reports (Encontro, Reencontro, Seja Livre)
 */
const EncounterReportView = ({ data, title, year, userRede }: { data: EncontroData, title: string, year: string, userRede?: string }) => {
    if (!data) return <div className="p-8 text-center text-slate-500">Sem dados para exibir.</div>;

    const myNetworkStats = useMemo(() => {
        if (!userRede) return null;
        return data.totaisPorRede?.find(
            (r) =>
                r._id.toLowerCase().includes(userRede.toLowerCase()) ||
                userRede.toLowerCase().includes(r._id.toLowerCase())
        );
    }, [data, userRede]);

    const barChartData: ChartData<"bar"> = useMemo(() => ({
        labels: (data.encontros || []).map((e) => `Enc. ${e.numero}`),
        datasets: [{
            label: "Participantes",
            data: (data.encontros || []).map((e) => e.totalParticipantes),
            backgroundColor: "#3b82f6",
            borderRadius: 4,
        }],
    }), [data]);

    const doughnutChartData: ChartData<"doughnut"> = useMemo(() => ({
        labels: (data.totaisPorRede || []).map((r) => r._id),
        datasets: [{
            label: "Participantes",
            data: (data.totaisPorRede || []).map((r) => r.total),
            backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"],
            borderWidth: 1,
        }],
    }), [data]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                <span className="text-sm text-slate-500 mb-1">vidas em {title} ({year})</span>
                            </div>
                        ) : (
                            <p className="text-slate-500">Nenhum dado encontrado para sua rede.</p>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Users className="w-8 h-8" /></div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Anual</p>
                            <p className="text-3xl font-bold">{data.totalAnual || 0}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600"><Calendar className="w-8 h-8" /></div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{title} Realizados</p>
                            <p className="text-3xl font-bold">{data.encontros?.length || 0}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-full text-orange-600"><Church className="w-8 h-8" /></div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Igrejas</p>
                            <p className="text-3xl font-bold">{data.totaisPorIgreja?.length || 0}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="text-base">Evolução ({title})</CardTitle></CardHeader>
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

            {/* PREVIEW TABLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="text-sm uppercase tracking-wide text-slate-500">Ranking das Redes</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(data.totaisPorRede || []).map((rede, i) => (
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
                            {(data.totaisPorIgreja || []).map((igreja, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <span className="font-medium text-slate-700">{igreja._id}</span>
                                    <div className="font-bold text-slate-900">{igreja.total}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Detalhamento por Encontro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(data.encontros || []).map((enc, i) => {
                        // Aggregate rede counts for this specific encounter
                        const redeCounts = (enc.encontristas || []).reduce((acc: any, curr: any) => {
                            const rede = curr.rede || 'Sem Rede';
                            acc[rede] = (acc[rede] || 0) + 1;
                            return acc;
                        }, {});

                        const sortedRedes = Object.entries(redeCounts).sort(([, a], [, b]) => (b as number) - (a as number));

                        return (
                            <Card key={i} className="overflow-hidden">
                                <CardHeader className="bg-slate-100 py-3 border-b">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-700">Encontro {enc.numero}</span>
                                        <span className="text-xs text-slate-500">{new Date(enc.data).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="text-sm text-slate-600">Total: <b>{enc.totalParticipantes}</b></div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-[200px] overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <tbody>
                                                {sortedRedes.map(([rede, count], idx) => (
                                                    <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                                                        <td className="p-2 text-slate-600 pl-4">{rede}</td>
                                                        <td className="p-2 font-semibold text-right pr-4">{count as number}</td>
                                                    </tr>
                                                ))}
                                                {sortedRedes.length === 0 && (
                                                    <tr><td colSpan={2} className="p-4 text-center text-slate-400">Sem dados de rede</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};


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
        encontro: null, reencontro: null, sejaLivre: null,
        casasDePaz: [], visitasDePaz: [], escolaProfeta: null
    };

    // --- CASAS DE PAZ CHARTS ---
    const casasChartData: ChartData<"line"> = useMemo(() => {
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const monthlyData = new Array(12).fill(0);
        (data.casasDePaz || []).forEach(item => {
            if (item.month >= 1 && item.month <= 12) monthlyData[item.month - 1] = item.total;
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
        const sortedData = [...(data.visitasDePaz || [])].sort((a, b) => a.date.localeCompare(b.date));
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

    // --- ESCOLA CHARTS ---
    const escolaBarData: ChartData<"bar"> = useMemo(() => {
        const courses = data.escolaProfeta?.courses || [];
        return {
            labels: courses.map(c => c.tema),
            datasets: [{
                label: "Alunos",
                data: courses.map(c => c.totalAlunos),
                backgroundColor: "#8b5cf6"
            }]
        }
    }, [data.escolaProfeta])


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
                <TabsList className="flex w-full justify-start h-auto mb-8 bg-white p-1 border overflow-x-auto">
                    <TabsTrigger value="encontro" className="flex-shrink-0"><Calendar className="w-4 h-4 mr-2" /> Encontros</TabsTrigger>
                    <TabsTrigger value="reencontro" className="flex-shrink-0"><Calendar className="w-4 h-4 mr-2" /> Reencontro</TabsTrigger>
                    <TabsTrigger value="sejalivre" className="flex-shrink-0"><Calendar className="w-4 h-4 mr-2" /> Seja Livre</TabsTrigger>
                    <TabsTrigger value="escola" className="flex-shrink-0"><BookOpen className="w-4 h-4 mr-2" /> Escola Profeta</TabsTrigger>
                    <TabsTrigger value="casas" className="flex-shrink-0"><Home className="w-4 h-4 mr-2" /> Casas de Paz</TabsTrigger>
                    <TabsTrigger value="visitas" className="flex-shrink-0"><UserCheck className="w-4 h-4 mr-2" /> Visitas</TabsTrigger>
                </TabsList>

                <TabsContent value="encontro">
                    <EncounterReportView data={data.encontro as EncontroData} title="Encontro com Deus" year={year} userRede={userRede} />
                </TabsContent>

                <TabsContent value="reencontro">
                    <EncounterReportView data={data.reencontro as EncontroData} title="Reencontro" year={year} userRede={userRede} />
                </TabsContent>

                <TabsContent value="sejalivre">
                    <EncounterReportView data={data.sejaLivre as EncontroData} title="Seja Livre" year={year} userRede={userRede} />
                </TabsContent>

                <TabsContent value="escola" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {!data.escolaProfeta ? <div className="p-8 text-center text-slate-500">Sem dados.</div> : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm font-medium text-muted-foreground">Total de Alunos</p>
                                        <p className="text-3xl font-bold">{data.escolaProfeta.totalStudents}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm font-medium text-muted-foreground">Turmas Realizadas</p>
                                        <p className="text-3xl font-bold">{data.escolaProfeta.courses.length}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="pt-6">
                                        <p className="text-sm font-medium text-green-700">Aprovados (Est.)</p>
                                        <p className="text-3xl font-bold text-green-800">{data.escolaProfeta.aprovados}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-red-50 border-red-200">
                                    <CardContent className="pt-6">
                                        <p className="text-sm font-medium text-red-700">Reprovados (Est.)</p>
                                        <p className="text-3xl font-bold text-red-800">{data.escolaProfeta.reprovados}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader><CardTitle>Alunos por Turma</CardTitle></CardHeader>
                                <CardContent className="h-[300px]">
                                    <Bar data={escolaBarData} options={{ maintainAspectRatio: false }} />
                                </CardContent>
                            </Card>
                        </>
                    )}
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
                                        {(data.casasDePaz || []).reduce((acc, curr) => acc + curr.total, 0)}
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
                                        {(data.visitasDePaz || []).reduce((acc, curr) => acc + curr.total, 0)}
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
