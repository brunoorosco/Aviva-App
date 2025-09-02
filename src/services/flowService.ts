import { FlowMongoRepository } from '../infra/db/repositories/mongo/flow'

export class FlowService {
  constructor(private repo: FlowMongoRepository) {}

  // Salva a estrutura do flow dentro da igreja
  async saveChurchFlow(churchId: string, data: any) {
    //const reactFlowData = this.generateReactFlow(data)
    // Salvar subdocumento organograma
    await this.repo.saveFlow(churchId, data)
    return data
  }

  private generateReactFlow(data: any) {
    const nodes: any[] = []
    const edges: any[] = []
    let nodeId = 0

    const addNode = (label: string) => {
      const id = `n${nodeId++}`
      nodes.push({
        id,
        data: { label },
        position: { x: Math.random() * 600, y: Math.random() * 400 }
      })
      return id
    }

    const pastorId = addNode(data.pastor)

    data.groups.forEach((group: any) => {
      const supLabel = `${group.sup1}/${group.sup2}`
      const supId = addNode(supLabel)
      edges.push({ id: `e${nodeId++}`, source: pastorId, target: supId })

      group.cems.forEach((cem: any) => {
        const cemId = addNode(cem.name)
        edges.push({ id: `e${nodeId++}`, source: supId, target: cemId })

        cem.leaders.forEach((leader: any) => {
          const leaderLabel = `${leader.name1}/${leader.name2}`
          const leaderId = addNode(leaderLabel)
          edges.push({ id: `e${nodeId++}`, source: cemId, target: leaderId })

          leader.auxiliares.forEach((aux: any) => {
            const auxId = addNode(aux.name)
            edges.push({ id: `e${nodeId++}`, source: leaderId, target: auxId })

            aux.users.forEach((user: any) => {
              const userId = addNode(`${user.name} (${user.role})`)
              edges.push({ id: `e${nodeId++}`, source: auxId, target: userId })
            })
          })
        })
      })
    })

    return { nodes, edges }
  }
}

export const flowService = new FlowService(new FlowMongoRepository())
