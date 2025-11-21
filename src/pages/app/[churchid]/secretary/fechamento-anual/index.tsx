import React, { useMemo } from "react";
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
import { Save, Calendar, Users, Church, Network, LucideIcon } from "lucide-react";
import { useHttpGet } from "@/hooks/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface StatItem {
  _id: string;
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

export default function RelatorioEncontro() {
  const { data: session } = useSession();
  const churchId = session?.user.churchId;

  const { data, isLoading } = useHttpGet<DashboardData>(
    churchId ? `/api/protected/churches/${churchId}/fechamento-anual` : null
  );

  // Se ainda não chegou nada, evita crashes
  const dataFromMongo = data?.data ?? {
    totalAnual: 0,
    totaisPorRede: [],
    totaisPorIgreja: [],
    encontros: [],
  };

  // ------------------------------
  // GRÁFICO DE BARRAS
  // ------------------------------
  const barChartData: ChartData<"bar"> = useMemo(
    () => ({
      labels: dataFromMongo.encontros.map((e) => `Enc. ${e.numero}`),
      datasets: [
        {
          label: "Total de Participantes",
          data: dataFromMongo.encontros.map((e) => e.totalParticipantes),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderRadius: 4,
        },
      ],
    }),
    [dataFromMongo] // DEPENDÊNCIA CORRETA
  );

  // ------------------------------
  // GRÁFICO DONUT
  // ------------------------------
  const doughnutChartData: ChartData<"doughnut"> = useMemo(
    () => ({
      labels: dataFromMongo.totaisPorRede.map((r) => r._id),
      datasets: [
        {
          label: "Participantes",
          data: dataFromMongo.totaisPorRede.map((r) => r.total),
          backgroundColor: [
            "#3b82f6",
            "#ef4444",
            "#10b981",
            "#f59e0b",
            "#8b5cf6",
            "#ec4899",
            "#6366f1",
            "#14b8a6",
          ],
          borderWidth: 1,
        },
      ],
    }),
    [dataFromMongo] // DEPENDÊNCIA CORRETA
  );

  // Loading bonito
  if (isLoading)
    return (
      <div className="p-10 text-center text-lg text-slate-500">
        Carregando relatório...
      </div>
    );

  // ------------------------------
  // SALVAR FECHAMENTO
  // ------------------------------
  const handleSaveClosing = () => {
    const payload = {
      year: 2025,
      stats: dataFromMongo,
      closedAt: new Date().toISOString(),
    };
    console.log("Salvando fechamento anual...", payload);
    alert("Fechamento salvo!");
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Fechamento Anual - Encontro com Deus
          </h1>
          <p className="text-slate-500 mt-1">
            Relatório consolidado do ano de 2025
          </p>
        </div>
        <button
          onClick={handleSaveClosing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          Salvar Fechamento
        </button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* TOTAL */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total de Vidas</p>
            <p className="text-2xl font-bold">{dataFromMongo.totalAnual}</p>
          </div>
        </div>

        {/* ENCONTROS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Encontros Realizados</p>
            <p className="text-2xl font-bold">{dataFromMongo.encontros.length}</p>
          </div>
        </div>

        {/* REDE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Rede Destaque</p>
            <p className="text-lg font-bold truncate w-32">
              {dataFromMongo.totaisPorRede[0]?._id ?? "-"}
            </p>
            <span className="text-xs text-slate-400">
              {dataFromMongo.totaisPorRede[0]?.total ?? 0} pessoas
            </span>
          </div>
        </div>

        {/* IGREJAS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-full text-orange-600">
            <Church className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Igrejas Participantes</p>
            <p className="text-2xl font-bold">
              {dataFromMongo.totaisPorIgreja.length}
            </p>
          </div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">
              Evolução por Encontro
            </h3>
          </div>
          <div className="p-6 h-80">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">
              Distribuição por Rede
            </h3>
          </div>
          <div className="p-6 h-80 flex justify-center">
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* TABELAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Redes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Ranking por Rede</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3">Rede</th>
                  <th className="px-6 py-3 text-right">Total</th>
                  <th className="px-6 py-3 text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataFromMongo.totaisPorRede.map((rede, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{rede._id}</td>
                    <td className="px-6 py-3 text-right">{rede.total}</td>
                    <td className="px-6 py-3 text-right">
                      {dataFromMongo.totalAnual
                        ? ((rede.total / dataFromMongo.totalAnual) * 100).toFixed(1)
                        : "0.0"}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Igrejas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Church className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Participação por Igreja</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3">Igreja</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataFromMongo.totaisPorIgreja.map((igreja, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{igreja._id}</td>
                    <td className="px-6 py-3 text-right">{igreja.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
