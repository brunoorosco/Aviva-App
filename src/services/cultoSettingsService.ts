import { CultoSettingsMongoRepository } from '../infra/db/repositories/mongo/cultoSettings'
import { CultoDomingo, DEFAULT_CULTO_DOMINGO } from '@/domain/models/cultoSettings'

const VALID_VALUES: CultoDomingo[] = ['manha', 'noite', 'manha_e_noite']

export class CultoSettingsService {
  constructor(private repo: CultoSettingsMongoRepository) {}

  async getCultoDomingo(churchId: string): Promise<CultoDomingo> {
    try {
      return await this.repo.getCultoDomingo(churchId)
    } catch {
      return DEFAULT_CULTO_DOMINGO
    }
  }

  async saveCultoDomingo(churchId: string, value: CultoDomingo): Promise<void> {
    if (!VALID_VALUES.includes(value)) {
      throw new Error('Valor inválido para cultoDomingo')
    }
    await this.repo.saveCultoDomingo(churchId, value)
  }
}