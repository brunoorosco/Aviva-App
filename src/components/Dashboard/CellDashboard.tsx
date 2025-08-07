// src/components/CellDashboard.tsx
import { User } from '@/domain/models/users'
import { useState, useEffect } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'

interface RoleCount {
  name: string
  value: number
}

interface CellData {
  name: string
  total: number
  active: number
  inactive: number
  roles: RoleCount[]
}
export type Props = {
  members: User[]
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
  '#FF6B6B',
  '#4ECDC4',
  '#FFA07A',
  '#20B2AA'
]

export default function CellDashboard({ members }: Props) {
  const [cellsData, setCellsData] = useState<CellData[]>([])
  const [totalChurchMembers, setTotalChurchMembers] = useState(0)
  const [totalChurchActive, setTotalChurchActive] = useState(0)
  const [totalChurchInactive, setTotalChurchInactive] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!members || members.length === 0) {
      setLoading(false)
    } else {
      processData(members)
      setLoading(false)
    }
  }, [members])

  const processData = (membersData: User[]) => {
    // Processar dados gerais da igreja
    setTotalChurchMembers(membersData.length)
    setTotalChurchActive(membersData.filter((m) => m.active).length)
    setTotalChurchInactive(membersData.filter((m) => !m.active).length)

    // Processar dados por célula
    const cellsMap = new Map<
      string,
      {
        name: string
        total: number
        active: number
        inactive: number
        roles: Record<string, number>
      }
    >()

    membersData.forEach((member) => {
      if (member.cem?.name) {
        if (!cellsMap.has(member.cem.name)) {
          cellsMap.set(member.cem.name, {
            name: member.cem.name,
            total: 0,
            active: 0,
            inactive: 0,
            roles: {}
          })
        }

        const cell = cellsMap.get(member.cem.name)!
        cell.total++
        if (member.active) {
          cell.active++
        } else {
          cell.inactive++
        }

        // Adicionar ou incrementar o cargo
        cell.roles[member.role] = (cell.roles[member.role.toUpperCase()] || 0) + 1
      }
    })

    // Transformar o objeto de cargos em um array RoleCount para o gráfico
    const cellsDataWithRoles = Array.from(cellsMap.values()).map((cell) => ({
      ...cell,
      roles: Object.entries(cell.roles).map(([name, value]) => ({
        name:name.toUpperCase(),
        value
      }))
    }))

    setCellsData(cellsDataWithRoles)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-xl'>Carregando dados...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <div className='max-w-8xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>
          Dashboard da Igreja
        </h1>

        {/* Cards de resumo geral */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8'>
          <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
            <h3 className='text-sm md:text-base font-medium text-gray-500 mb-2'>
              Total de Membros
            </h3>
            <p className='text-2xl md:text-4xl font-bold text-blue-600'>
              {totalChurchMembers}
            </p>
          </div>

          <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
            <h3 className='text-sm md:text-base font-medium text-gray-500 mb-2'>
              Membros Ativos
            </h3>
            <p className='text-2xl md:text-4xl font-bold text-green-600'>
              {totalChurchActive}
            </p>
          </div>

          <div className='bg-white p-4 md:p-6 rounded-lg shadow'>
            <h3 className='text-sm md:text-base font-medium text-gray-500 mb-2'>
              Membros Inativos
            </h3>
            <p className='text-2xl md:text-4xl font-bold text-red-600'>
              {totalChurchInactive}
            </p>
          </div>
        </div>

        {/* Cards de células */}
        <h2 className='text-xl md:text-2xl font-bold text-gray-700 mb-4 md:mb-6'>
          Células da Igreja
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {cellsData.map((cell, cellIndex) => (
            <div
              key={cell.name}
              className='bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full'
            >
              <div className='p-3 md:p-4 border-b border-gray-200'>
                <h3 className='text-lg md:text-xl font-semibold text-gray-800'>
                  {cell.name}
                </h3>
              </div>

              <div className='p-3 md:p-4 flex-grow'>
                {/* Estatísticas da célula */}
                <div className='grid grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-5'>
                  <div className='text-center'>
                    <p className='text-xs md:text-sm text-gray-500'>Total</p>
                    <p className='text-xl md:text-2xl font-bold'>
                      {cell.total}
                    </p>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs md:text-sm text-gray-500'>Ativos</p>
                    <p className='text-xl md:text-2xl font-bold text-green-600'>
                      {cell.active}
                    </p>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs md:text-sm text-gray-500'>Inativos</p>
                    <p className='text-xl md:text-2xl font-bold text-red-600'>
                      {cell.inactive}
                    </p>
                  </div>
                </div>

                {/* Gráfico de cargos */}
                <div className='h-40 md:h-48'>
                  {cell.roles.length > 0 && (
                    <ResponsiveContainer width='100%' height='100%'>
                      <PieChart width={730} height={250} key={cellIndex.toString()}>
                        {/* <Pie
                          data={cell.roles}
                          cx='50%'
                          cy='50%'
                          innerRadius={25}
                          outerRadius={60}
                          fill='#8884d8'
                          paddingAngle={5}
                          label={({ name, percent }) =>
                            `${name}: ${(Number(percent) * 100).toFixed(0)}%`
                          }
                        >
                          {cell.roles.map((entry, idx) => (
                            <Cell
                              key={entry.name}
                              fill={String(COLORS[idx % COLORS.length])}
                            />
                          ))}
                        </Pie> */}
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )
                  //  (
                  //   <div className='flex items-center justify-center h-full'>
                  //     <p className='text-center text-gray-500 text-sm'>
                  //       Sem dados de cargos
                  //     </p>
                  //   </div>
                  // )
                  }
                </div>

                {/* Lista de cargos */}
                <div className='mt-4'>
                  <h4 className='font-medium text-gray-700 mb-2 text-sm md:text-base'>
                    Distribuição de Cargos:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {cell.roles.map((role, index) => (
                      <span
                        key={String(index)}
                        className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
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
          <div className='bg-white p-6 rounded-lg shadow text-center mt-8'>
            <p className='text-gray-500'>Nenhuma célula encontrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
