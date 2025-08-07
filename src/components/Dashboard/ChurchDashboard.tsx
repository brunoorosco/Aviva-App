// src/components/ChurchDashboard.tsx
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Tipos para nossos dados
interface ChurchMember {
  id: string;
  name: string;
  cell: string;
  isActive: boolean;
  role: string;
}

interface CellData {
  name: string;
  count: number;
}

interface RoleData {
  role: string;
  count: number;
}

interface DashboardProps {
  // Você pode modificar conforme sua API
  members?: ChurchMember[];
  cellsData?: CellData[];
  rolesData?: RoleData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ChurchDashboard({ members, cellsData, rolesData }: DashboardProps) {
  // Estados para nossos dados
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [inactiveMembers, setInactiveMembers] = useState(0);
  const [cellsChartData, setCellsChartData] = useState<CellData[]>([]);
  const [rolesChartData, setRolesChartData] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se você não passar os dados via props, podemos simular aqui
    if (!cellsData || !rolesData) {
      // Dados de exemplo para demonstração
      const sampleMembers: ChurchMember[] = [
        { id: '1', name: 'João Silva', cell: 'Vida Nova', isActive: true, role: 'Líder' },
        { id: '2', name: 'Maria Souza', cell: 'Vida Nova', isActive: true, role: 'Membro' },
        { id: '3', name: 'Pedro Oliveira', cell: 'Familias', isActive: false, role: 'Membro' },
        { id: '4', name: 'Ana Costa', cell: 'Jovens', isActive: true, role: 'Líder de Jovens' },
        { id: '5', name: 'Carlos Pereira', cell: 'Familias', isActive: true, role: 'Membro' },
        { id: '6', name: 'Paula Ferreira', cell: 'Liderança', isActive: true, role: 'Ancião' },
        { id: '7', name: 'Rafael Martins', cell: 'Jovens', isActive: true, role: 'Mentor' },
      ];

      setTotalMembers(sampleMembers.length);
      setActiveMembers(sampleMembers.filter(m => m.isActive).length);
      setInactiveMembers(sampleMembers.filter(m => !m.isActive).length);

      // Processar dados de células
      const cellsMap = new Map<string, number>();
      sampleMembers.forEach(member => {
        const count = cellsMap.get(member.cell) || 0;
        cellsMap.set(member.cell, count + 1);
      });
      const cellsData = Array.from(cellsMap, ([name, count]) => ({ name, count }));
      setCellsChartData(cellsData);

      // Processar dados de cargos
      const rolesMap = new Map<string, number>();
      sampleMembers.forEach(member => {
        const count = rolesMap.get(member.role) || 0;
        rolesMap.set(member.role, count + 1);
      });
      const rolesData = Array.from(rolesMap, ([role, count]) => ({ role, count }));
      setRolesChartData(rolesData);

      setLoading(false);
    } else {
      // Usar os dados passados via props
      if (members) {
        setTotalMembers(members.length);
        setActiveMembers(members.filter(m => m.isActive).length);
        setInactiveMembers(members.filter(m => !m.isActive).length);
      }

      setCellsChartData(cellsData);
      setRolesChartData(rolesData);
      setLoading(false);
    }
  }, [members, cellsData, rolesData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard da Igreja</h1>
        
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500 mb-2">Total de Membros</h3>
            <p className="text-4xl font-bold text-blue-600">{totalMembers}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500 mb-2">Membros Ativos</h3>
            <p className="text-4xl font-bold text-green-600">{activeMembers}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500 mb-2">Membros Inativos</h3>
            <p className="text-4xl font-bold text-red-600">{inactiveMembers}</p>
          </div>
        </div>
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de membros por célula */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Membros por Célula</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cellsChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name}: ${(Number(percent) * 100).toFixed(0)}%`}
                >
                  {cellsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Gráfico de membros por cargo */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Membros por Cargo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rolesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Quantidade">
                  {rolesChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Tabela de membros (opcional) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Lista de Membros</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Célula
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members?.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.cell}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
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