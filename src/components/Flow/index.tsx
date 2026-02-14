import { useState, useEffect } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MiniMap
} from '@xyflow/react'
import { EditNodeModal } from './EditNodeModal'
import { PastorNode } from './nodes/PastorNode'
import { SupervisorNode } from './nodes/SupervisorNode'
import { LiderNode } from './nodes/LiderNode'

export default function ChurchFlowPage({ churchId }: { churchId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<any | null>(null)
  const [rawFlow, setRawFlow] = useState<any | null>(null)

  // busca ou inicia o fluxo
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/protected/churches/${churchId}/flow`)
        const data = await res.json()
        if (data?.flow) {
          setRawFlow(data.flow)
        } else {
          setRawFlow({ pastor: 'Novo Pastor', groups: [] })
        }
      } catch (err) {
        console.error('Erro ao buscar organograma:', err)
        setRawFlow({ pastor: 'Novo Pastor', groups: [] })
      }
    })()
  }, [churchId])

  // transforma rawFlow em nodes/edges
  useEffect(() => {
    if (!rawFlow) return

    const nodes: any[] = []
    const edges: any[] = []

    // Pastor
    nodes.push({
      id: 'pastor',
      type: 'pastor',
      data: { label: rawFlow.pastor, onEdit: handleEdit },
      position: { x: 400, y: 40 }
    })

    rawFlow.groups.forEach((group: any, gIdx: number) => {
      const supId = `sup-${gIdx}`
      nodes.push({
        id: supId,
        type: 'supervisor',
        data: { label: `${group.sup1} / ${group.sup2}`, onEdit: handleEdit },
        position: { x: 200 + gIdx * 250, y: 200 }
      })
      edges.push({ id: `e-pastor-${supId}`, source: 'pastor', target: supId })

      group.cems?.forEach((cem: any, cIdx: number) => {
        cem.leaders?.forEach((leader: any, lIdx: number) => {
          const leaderId = `leader-${gIdx}-${cIdx}-${lIdx}`
          nodes.push({
            id: leaderId,
            type: 'leader',
            data: {
              label: `${leader.name1} / ${leader.name2}`,
              onEdit: handleEdit
            },
            position: { x: 150 + lIdx * 200, y: 350 }
          })
          edges.push({
            id: `e-${supId}-${leaderId}`,
            source: supId,
            target: leaderId
          })
        })
      })
    })

    // @ts-ignore
    setNodes(nodes)
    // @ts-ignore
    setEdges(edges)
  }, [rawFlow])

  const handleEdit = (id: string) => {
    //@ts-ignore
    const node = nodes.find((n) => n.id === id)
    if (node) setSelectedNode(node)
  }

  const handleSave = (values: any) => {
    if (!selectedNode) return
    // atualiza o rawFlow com o novo valor
    if (selectedNode.type === 'pastor') {
      setRawFlow((prev: any) => ({ ...prev, pastor: values.label }))
    }
    if (selectedNode.type === 'supervisor') {
      const [_, gIdx] = selectedNode.id.split('-')
      setRawFlow((prev: any) => {
        const copy = { ...prev }
        copy.groups[gIdx].sup1 = values.sup1 || copy.groups[gIdx].sup1
        copy.groups[gIdx].sup2 = values.sup2 || copy.groups[gIdx].sup2
        return copy
      })
    }
    // idem para leader, aux, user...

    setSelectedNode(null)
  }

  return (
    <div className='w-full h-[90vh]'>
      <Toolbar
        onAddSupervisor={() =>
          setRawFlow((prev: any) =>
            prev
              ? {
                  ...prev,
                  groups: [
                    ...prev.groups,
                    { sup1: 'Novo Sup 1', sup2: 'Novo Sup 2', cems: [] }
                  ]
                }
              : prev
          )
        }
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
        fitView
        nodeTypes={{
          pastor: PastorNode,
          supervisor: SupervisorNode,
          leader: LiderNode
        }}
        //@ts-ignore
        onNodeDoubleClick={(_, node) => handleEdit(node.id)} // duplo clique abre modal
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      <EditNodeModal
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        onSave={handleSave}
        initialData={selectedNode?.data || { label: '' }}
      />
    </div>
  )
}

function Toolbar({ onAddSupervisor }: { onAddSupervisor: () => void }) {
  return (
    <div className='absolute top-2 left-2 bg-card text-card-foreground shadow rounded p-2 z-10 flex gap-2'>
      <button
        className='px-3 py-1 bg-blue-600 text-white rounded'
        onClick={onAddSupervisor}
      >
        + Supervisor
      </button>
    </div>
  )
}
