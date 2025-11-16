// src/pages/dashboard.tsx
import { useEffect, useState } from 'react';
import ChurchDashboard from './ChurchDashboard';
// import ChurchMember from './types/ChurchMember'; // Você precisará criar este tipo

interface CellData {
  name: string;
  count: number;
}

interface RoleData {
  role: string;
  count: number;
}

export default function DashboardChurch() {
  const [members, setMembers] = useState<any[]>([]);
  const [cellsData, setCellsData] = useState<CellData[]>([]);
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Substitua pela sua chamada à API
    const fetchData = async () => {
      try {
        // Exemplo de chamada à API:
        // const response = await fetch('/api/church-members');
        // const data = await response.json();
        
        // Simulando uma resposta da API para demonstração
        // Você pode remover isso quando estiver usando sua própria API
        setTimeout(() => {
          const mockData = {
            members: [
              { id: '1', name: 'João Silva', cell: 'Vida Nova', isActive: true, role: 'Lider' },
              { id: '2', name: 'Maria Souza', cell: 'Vida Nova', isActive: true, role: 'Membro' },
              { id: '3', name: 'Pedro Oliveira', cell: 'Familias', isActive: false, role: 'Membro' },
              { id: '4', name: 'Ana Costa', cell: 'Jovens', isActive: true, role: 'Lider de Jovens' },
              { id: '5', name: 'Carlos Pereira', cell: 'Familias', isActive: true, role: 'Membro' },
              { id: '6', name: 'Paula Ferreira', cell: 'Liderança', isActive: true, role: 'Ancião' },
              { id: '7', name: 'Rafael Martins', cell: 'Jovens', isActive: true, role: 'Mentor' },
            ],
            cells: [
              { name: 'Vida Nova', count: 2 },
              { name: 'Familias', count: 2 },
              { name: 'Jovens', count: 2 },
              { name: 'Liderança', count: 1 },
            ],
            roles: [
              { role: 'Lider', count: 1 },
              { role: 'Membro', count: 3 },
              { role: 'Lider de Jovens', count: 1 },
              { role: 'Ancião', count: 1 },
              { role: 'Mentor', count: 1 },
            ]
          };
          
          setMembers(mockData.members);
          setCellsData(mockData.cells);
          setRolesData(mockData.roles);
          setLoading(false);
        }, 1000); // Simulando um delay de carregamento
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <ChurchDashboard
      members={members}
      cellsData={cellsData}
      rolesData={rolesData}
    />
  );
}