import { FlowMongoRepository } from '@/infra/db/repositories/mongo/flow'
import { FlowService } from '@/services/flowService'

const repo = new FlowMongoRepository()
const service = new FlowService(repo)

export async function saveChurchFlowAction(churchId: string, payload: any) {
  // salva e retorna os nodes/edges para React Flow
  return service.saveChurchFlow(churchId, payload)
}
