// utils/flowGenerator.ts
export type User = { name: string; role: string }
export type Auxiliar = { name: string; users: User[] }
export type Leader = { name1: string; name2: string; auxiliar: Auxiliar[] }
export type Cem = { name: string; leaders: Leader[] }
export type SupervisorGroup = { sup1: string; sup2: string; cems: Cem[] }

type Node = {
  id: string
  data: { label: string }
  position: { x: number; y: number }
  type?: string
  style?: { background?: string; color?: string }
}

type Edge = { id: string; source: string; target: string; type?: string }

let nodeCounter = 0

export function generateFlow(
  pastorName: string,
  groups: SupervisorGroup[]
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  function createNode(label: string, color: string, x: number, y: number) {
    const id = `node-${nodeCounter++}`
    nodes.push({
      id,
      data: { label },
      position: { x, y },
      style: { background: color, color: '#fff' }
    })
    return id
  }

  let yStart = 0
  const pastorId = createNode(pastorName, '#1f2937', 400, yStart) // Dark Gray

  yStart += 100

  groups.forEach((group, gIdx) => {
    const supLabel = `${group.sup1} / ${group.sup2}`
    const supId = createNode(supLabel, '#2563eb', gIdx * 250 + 100, yStart) // Blue
    edges.push({
      id: `e-${pastorId}-${supId}`,
      source: pastorId,
      target: supId
    })

    let yCem = yStart + 100
    group.cems.forEach((cem, cIdx) => {
      const cemId = createNode(
        cem.name,
        '#4ade80',
        gIdx * 250 + cIdx * 50,
        yCem
      ) // Green
      edges.push({ id: `e-${supId}-${cemId}`, source: supId, target: cemId })

      let yLeader = yCem + 80
      cem.leaders.forEach((leader) => {
        const leaderLabel = `${leader.name1} / ${leader.name2}`
        const leaderId = createNode(
          leaderLabel,
          '#facc15',
          gIdx * 250 + cIdx * 50,
          yLeader
        ) // Yellow
        edges.push({
          id: `e-${cemId}-${leaderId}`,
          source: cemId,
          target: leaderId
        })

        let yAux = yLeader + 60
        leader.auxiliar.forEach((aux) => {
          const auxId = createNode(
            aux.name,
            '#f97316',
            gIdx * 250 + cIdx * 50,
            yAux
          ) // Orange
          edges.push({
            id: `e-${leaderId}-${auxId}`,
            source: leaderId,
            target: auxId
          })

          let yUser = yAux + 40
          aux.users.forEach((user) => {
            const userId = createNode(
              user.name + ' (' + user.role + ')',
              '#6b7280',
              gIdx * 250 + cIdx * 50,
              yUser
            ) // Gray
            edges.push({
              id: `e-${auxId}-${userId}`,
              source: auxId,
              target: userId
            })
            yUser += 40
          })

          yAux += 100
        })
        yLeader += 150
      })
      yCem += 200
    })
  })

  return { nodes, edges }
}
