import { ObjectId } from 'mongodb'
import { ApresentacaoMongoRepository } from '../infra/db/repositories/mongo/apresentacao'
import {
  TCriancaItem,
} from '../domain/models/apresentacao'

export type CriarCursoInput = {
  churchId: string
  dataCurso: string
  dataApresentacao: string
  horario: 'manha' | 'noite'
  items: TCriancaItem[]
  criadoPor: { _id: string; name: string }
}

export type CriarCursoResult = {
  curso: any
  gerados: any[]
}

function parseDateOnly(d: string): Date {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, (m || 1) - 1, day || 1)
}

/**
 * Regra de negócio: data de apresentação precisa ser ESTREITAMENTE
 * depois da data do curso (igual não vale).
 */
export function validateCursoDates(dataCurso: string, dataApresentacao: string): string | null {
  if (!dataCurso || !dataApresentacao) return 'dataCurso e dataApresentção são obrigatórios'
  const d1 = parseDateOnly(dataCurso)
  const d2 = parseDateOnly(dataApresentacao)
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return 'data inválida'
  if (d2.getTime() <= d1.getTime()) {
    return 'A data da apresentação deve ser depois da data do curso'
  }
  return null
}

export class CursoCriancaService {
  constructor(private repo: ApresentacaoMongoRepository) {}

  async createCurso(input: CriarCursoInput): Promise<CriarCursoResult> {
    const dateError = validateCursoDates(input.dataCurso, input.dataApresentacao)
    if (dateError) throw new Error(dateError)

    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new Error('Informe ao menos uma criança')
    }
    for (const it of input.items) {
      if (!it.nomeCrianca?.trim()) throw new Error('Toda criança precisa de nome')
      if (!it.nomeMae?.trim()) throw new Error(`Criança "${it.nomeCrianca}" precisa do nome da mãe`)
      if (!it.rede) throw new Error(`Criança "${it.nomeCrianca}" precisa de uma rede`)
    }

    // 1) doc do curso
    const cursoDoc = {
      tipo: 'cursoCrianca' as const,
      dataCurso: input.dataCurso,
      dataApresentacao: input.dataApresentacao,
      horario: input.horario,
      items: input.items,
      criadoPor: input.criadoPor,
      cursoItems: [] as string[],
    }
    const insertedCurso: any = await this.repo.createCursoCrianca(input.churchId, cursoDoc)
    const cursoId = insertedCurso.insertedId as ObjectId

    // 2) docs das crianças
    const kids: any[] = input.items.map((it) => ({
      tipo: 'crianca',
      rede: it.rede,
      dataApresentacao: input.dataApresentacao,
      horario: input.horario,
      nomeCrianca: it.nomeCrianca.trim(),
      nomePai: it.nomePai?.trim() || '',
      nomeMae: it.nomeMae.trim(),
      cursoId,
    }))
    const kidsRes: any = await this.repo.insertManyCrianca(input.churchId, kids)
    const kidIds: string[] = (kidsRes.insertedIds || []).map((id: ObjectId) => id.toHexString())

    // 3) snapshott dos ids no curso (usado só pra debug/auditoria)
    await this.repo.updateCursoCriancaItems(input.churchId, cursoId.toHexString(), kidIds)

    const curso = await this.repo.getCursoCrianca(input.churchId, cursoId.toHexString())
    const gerados = await this.repo.getApresentacoesPorCursoId(input.churchId, cursoId.toHexString())

    return { curso, gerados }
  }
}

export const cursoCriancaService = new CursoCriancaService(new ApresentacaoMongoRepository())