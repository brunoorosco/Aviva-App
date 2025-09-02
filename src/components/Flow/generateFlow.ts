import { FlowData } from './types'

export function generateNodesAndEdges(
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
