// src/components/CellDashboard.tsx
import { User } from "@/domain/models/users";
import { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";

interface RoleCount {
  name: string;
  value: number;
}

interface CellData {
  name: string;
  total: number;
  active: number;
  inactive: number;
  roles: RoleCount[];
}
export type Props = {
  members: User[];
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#FF6B6B",
  "#4ECDC4",
  "#FFA07A",
  "#20B2AA",
];

export default function CellDashboard({ members }: Props) {
  const [cellsData, setCellsData] = useState<CellData[]>([]);
  const [totalChurchMembers, setTotalChurchMembers] = useState(0);
  const [totalChurchActive, setTotalChurchActive] = useState(0);
  const [totalChurchInactive, setTotalChurchInactive] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!members || members.length === 0) {
      setLoading(false);
    } else {
      processData(members);
      setLoading(false);
    }
  }, [members]);

  const processData = (membersData: User[]) => {
    // Processar dados gerais da igreja
    setTotalChurchMembers(membersData.length);
    setTotalChurchActive(membersData.filter((m) => m.active).length);
    setTotalChurchInactive(membersData.filter((m) => !m.active).length);

    // Processar dados por célula
    const cellsMap = new Map<
      string,
      {
        name: string;
        total: number;
        active: number;
        inactive: number;
        roles: Record<string, number>;
      }
    >();

    membersData.forEach((member) => {
      if (member.cem?.name) {
        if (!cellsMap.has(member.cem.name)) {
          cellsMap.set(member.cem.name, {
            name: member.cem.name,
            total: 0,
            active: 0,
            inactive: 0,
            roles: {},
          });
        }

        const cell = cellsMap.get(member.cem.name)!;
        cell.total++;
        if (member.active) {
          cell.active++;
        } else {
          cell.inactive++;
        }

        const roleName = member.role?.toUpperCase() || "SEM CARGO";
        cell.roles[roleName] = (cell.roles[roleName] || 0) + 1;
      }
    });

    // Transformar o objeto de cargos em um array RoleCount para o gráfico
    const cellsDataWithRoles = Array.from(cellsMap.values()).map((cell) => ({
      ...cell,
      roles: Object.entries(cell.roles).map(([name, value]) => ({
        name: name.toUpperCase(),
        value,
      })),
    }));

    setCellsData(cellsDataWithRoles);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-8">
      <div className="mx-auto max-w-8xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">Estrutura das Redes</h1>

        {/* Cards de resumo geral */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3 md:gap-6 md:mb-8">
          <div className="p-4 bg-white rounded-lg shadow md:p-6">
            <h3 className="mb-2 text-sm font-medium text-gray-500 md:text-base">
              Total de Membros
            </h3>
            <p className="text-2xl font-bold text-blue-600 md:text-4xl">{totalChurchMembers}</p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow md:p-6">
            <h3 className="mb-2 text-sm font-medium text-gray-500 md:text-base">Membros Ativos</h3>
            <p className="text-2xl font-bold text-green-600 md:text-4xl">{totalChurchActive}</p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow md:p-6">
            <h3 className="mb-2 text-sm font-medium text-gray-500 md:text-base">
              Membros Inativos
            </h3>
            <p className="text-2xl font-bold text-red-600 md:text-4xl">{totalChurchInactive}</p>
          </div>
        </div>

        {/* Cards de células */}
        <h2 className="mb-4 text-xl font-bold text-gray-700 md:text-2xl md:mb-6">
          Células da Igreja
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cellsData.map((cell, cellIndex) => (
            <div
              key={cell.name}
              className="flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-md"
            >
              <div className="p-3 border-b border-gray-200 md:p-4">
                <h3 className="text-lg font-semibold text-gray-800 md:text-xl">{cell.name}</h3>
              </div>

              <div className="flex-grow p-3 md:p-4">
                {/* Estatísticas da célula */}
                <div className="grid grid-cols-3 gap-2 mb-3 md:gap-4 md:mb-5">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 md:text-sm">Total</p>
                    <p className="text-xl font-bold md:text-2xl">{cell.total}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 md:text-sm">Ativos</p>
                    <p className="text-xl font-bold text-green-600 md:text-2xl">{cell.active}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 md:text-sm">Inativos</p>
                    <p className="text-xl font-bold text-red-600 md:text-2xl">{cell.inactive}</p>
                  </div>
                </div>

                {/* Gráfico de cargos */}
                <div className="h-52 md:h-48">
                  {cell.roles.length > 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <PieChart
                        data={cell.roles.map((r, idx) => ({
                          title: r.name,
                          value: r.value,
                          color: COLORS[idx % COLORS.length],
                        }))}
                        animate
                        lineWidth={40}
                        label={({ dataEntry }) =>
                          `${dataEntry.title}: ${Math.round(dataEntry.percentage)}%`
                        }
                        labelStyle={{
                          fontSize: "5px",
                          fill: "#555",
                        }}
                        radius={40}
                        labelPosition={70}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-center text-gray-500">Sem dados de cargos</p>
                    </div>
                  )}
                </div>

                {/* Lista de cargos */}
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700 md:text-base">
                    Distribuição de Cargos:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cell.roles.map((role, index) => (
                      <span
                        key={String(index)}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {role.name.toUpperCase()}: {role.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há células */}
        {cellsData.length === 0 && (
          <div className="p-6 mt-8 text-center bg-white rounded-lg shadow">
            <p className="text-gray-500">Nenhuma célula encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
