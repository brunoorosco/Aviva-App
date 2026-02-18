import { CasaDePaz } from '@/domain/models/casaDePaz'
import { CasasDePazRepository } from '@/infra/db/repositories/mongo/casasDePaz'
import { ObjectId } from 'mongodb'

const casasdePazRepository = new CasasDePazRepository()

export const getCasasDePazService = async (churchId: string) => {
  const result = await casasdePazRepository.getCasasDePaz(churchId)

  return result
}
export const getCasasdePazByIdService = async (
  churchId: string,
  casaDePazId: string
) => {
  const result = await casasdePazRepository.getCasasDePazById(casaDePazId)

  return result
}

export const createCasasDePazService = async (
  churchId: string,
  data: { casas: CasaDePaz[]; data_inicial: string }
): Promise<any> => {
  const casaMap = data.casas.map((casa) => ({
    ...trimCasaFields(casa), // ✅ aplica trim
    _id: new ObjectId()
  }));

  const response = await casasdePazRepository.createCasaDePaz({
    church_id: churchId,
    data_inicial: data.data_inicial,
    casas: casaMap
  });
  
  return response;
};

export const saveCasaDePazService = async (params: {
  visitaId?: string;
  church_id: string;
  dataInicial?: string;
  casa: CasaDePaz;
}) => {
  const { visitaId, casa } = params;
  
  if (!visitaId) {
    throw new Error('Data inicial é obrigatória para nova visita');
  }

  const casaTrimmed = trimCasaFields(casa); // ✅ aplica trim

  if (casa._id) {
    return casasdePazRepository.updateCasa(visitaId, casaTrimmed);
  }

  return casasdePazRepository.addCasa(visitaId, casaTrimmed);
};

// Helper para limpar strings de um objeto
const trimCasaFields = (casa: CasaDePaz): CasaDePaz => {
  const trimmed: any = { ...casa };
  
  // Trim em campos string diretos
  Object.keys(trimmed).forEach((key) => {
    if (typeof trimmed[key] === 'string') {
      trimmed[key] = trimmed[key].trim();
    }
  });

  // Trim em objetos aninhados (lider1, lider2)
  if (trimmed.lider1 && typeof trimmed.lider1 === 'object') {
    trimmed.lider1 = {
      ...trimmed.lider1,
      name: trimmed.lider1.name?.trim() || '',
    };
  }

  if (trimmed.lider2 && typeof trimmed.lider2 === 'object') {
    trimmed.lider2 = {
      ...trimmed.lider2,
      name: trimmed.lider2.name?.trim() || '',
    };
  }

  return trimmed;
};