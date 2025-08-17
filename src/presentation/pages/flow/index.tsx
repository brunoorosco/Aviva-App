'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Connection
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

type FlowData = {
  pastor: string
  groups: {
    sup1: string
    sup2: string
    cems: {
      name: string
      leaders: {
        name1: string
        name2: string
        auxiliares: {
          name: string
          users: { name: string; role: string }[]
        }[]
      }[]
    }[]
  }[]
}

export default function ChurchFlowPage({ churchId }: { churchId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [rawFlow, setRawFlow] = useState<FlowData | null>(null)

  // Guarda quais CEMs estão colapsados: chave = id do node (ex: "cem-0-2")
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({})

  const handleToggle = useCallback((id: string) => {
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const onConnect = (params: Connection) => setEdges(eds => addEdge(params, eds))

  // 1) Faz 1 fetch só
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/protected/churches/${churchId}/flow`)
        const data = await res.json()
        const flow: FlowData = data?.flow ?? data
        setRawFlow(flow)
      } catch (err) {
        console.error('Erro ao buscar organograma:', err)
      }
    })()
  }, [churchId])

  // 2) Sempre que rawFlow OU collapsedNodes mudarem, regera nodes/edges
  useEffect(() => {
    if (!rawFlow) return
    const { nodes: n, edges: e } = generateNodesAndEdges(rawFlow, collapsedNodes, handleToggle)
    setNodes(n)
    setEdges(e)
  }, [rawFlow, collapsedNodes, setNodes, setEdges, handleToggle])

  const nodeTypes = { collapsible: CollapsibleNode }
  const edgeTypes = {}

  return (
    <div className="w-full h-[90vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="top-right"
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <MiniMap zoomable pannable />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}

/* ---------- geração de nodes/edges com IDs determinísticos e collapse ---------- */

function generateNodesAndEdges(
  data: FlowData,
  collapsed: Record<string, boolean>,
  onToggle: (id: string) => void
) {
  const nodes: any[] = []
  const edges: any[] = []

  const levelY = 120
  const groupSpacingX = 280
  const baseX = 200

  const addNode = (
    id: string,
    label: string,
    x: number,
    y: number,
    opts?: {
      bg?: string
      color?: string
      type?: 'default' | 'collapsible'
      extraData?: Record<string, any>
    }
  ) => {
    const { bg = '#fff', color = '#000', type = 'default', extraData = {} } = opts || {}
    nodes.push({
      id,
      type,
      data: { label, ...extraData },
      position: { x, y },
      style: {
        padding: '6px 20px',
        background: bg,
        color,
        borderRadius: 4,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        width: 'auto'
      }
    })
  }

  const addEdge = (source: string, target: string) => {
    edges.push({ id: `e-${source}-${target}`, source, target })
  }

  // Pastor
  const pastorId = 'pastor'
  addNode(pastorId, data.pastor, 420, 40, { bg: '#a7d50d', color: '#000' })

  // Supervisores
  data.groups.forEach((group, gIdx) => {
    const supId = `sup-${gIdx}`
    const supLabel = `${group.sup1 || '---'} / ${group.sup2 || '---'}`
    const supX = baseX + gIdx * groupSpacingX
    const supY = 40 + levelY

    addNode(supId, supLabel, supX, supY, { bg: '#2563eb', color: '#fff' })
    addEdge(pastorId, supId)

    // CEMs
    const cemCount = group.cems?.length ?? 0
    group.cems?.forEach((cem, cIdx) => {
      const cemId = `cem-${gIdx}-${cIdx}`
      const cemX =
        cemCount > 1
          ? supX - (groupSpacingX / 2) + (cIdx * (groupSpacingX / (cemCount - 1 || 1)))
          : supX
      const cemY = supY + levelY

      addNode(cemId, `CEM: ${cem.name}`, cemX, cemY, {
        type: 'collapsible',
        bg: '#e5e7eb',
        color: '#111827',
        extraData: { collapsed: !!collapsed[cemId], onToggle }
      })
      addEdge(supId, cemId)

      // Só desenha filhos se NÃO estiver colapsado
      if (!collapsed[cemId]) {
        // Líderes
        cem.leaders?.forEach((leader, lIdx) => {
          const leaderId = `leader-${gIdx}-${cIdx}-${lIdx}`
          const leaderLabel = `${leader.name1} / ${leader.name2}`
          const leaderX = cemX - 60 + lIdx * 120
          const leaderY = cemY + levelY

          addNode(leaderId, leaderLabel, leaderX, leaderY, { bg: '#facc15', color: '#111827' })
          addEdge(cemId, leaderId)

          // Auxiliares
          leader.auxiliares?.forEach((aux, aIdx) => {
            const auxId = `aux-${gIdx}-${cIdx}-${lIdx}-${aIdx}`
            const auxX = leaderX - 40 + aIdx * 80
            const auxY = leaderY + levelY

            addNode(auxId, aux.name, auxX, auxY, { bg: '#16a34a', color: '#fff' })
            addEdge(leaderId, auxId)

            // Usuários
            aux.users?.forEach((user, uIdx) => {
              const userId = `user-${gIdx}-${cIdx}-${lIdx}-${aIdx}-${uIdx}`
              const userX = auxX
              const userY = auxY + 50 + uIdx * 38

              addNode(userId, `${user.name} (${user.role})`, userX, userY, {
                bg: '#6b7280',
                color: '#fff'
              })
              addEdge(auxId, userId)
            })
          })
        })
      }
    })
  })

  return { nodes, edges }
}

/* ---------- custom node com botão de collapse ---------- */

function CollapsibleNode({ id, data }: any) {
  return (
    <div className="rounded bg-gray-200 px-3 py-2 shadow">
      <div className="flex items-center gap-2">
        <button
          onClick={() => data.onToggle(id)}
          className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white"
          title={data.collapsed ? 'Expandir' : 'Recolher'}
        >
          {data.collapsed ? '+' : '-'}
        </button>
        <span className="font-medium">{data.label}</span>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
