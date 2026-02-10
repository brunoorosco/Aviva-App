import { TMinisterialLevel } from "@/domain/models/ministerial";
import { ConsagracaoRepository } from "@/infra/db/repositories/mongo/consagracao";
import { UsersMongoRepository } from "@/infra/db/repositories/mongo/users";

const consagracaoRepository = new ConsagracaoRepository();
const userRepository = new UsersMongoRepository();

export const getConsagracaoByChurchIdService = async (churchId: string) => {
  const result = await consagracaoRepository.getConsagracaoByChurch(churchId);
  return result;
};
export const getConsagracaoByIdService = async (churchId: string, casaDePazId: string) => {
  const result = await consagracaoRepository.getConsagracaoById(churchId, casaDePazId);

  return result;
};

export const createConsagracaoService = async (churchId: string, date: Date): Promise<any> => {
  const response = await consagracaoRepository.createConsagracao(churchId, date);
  return response;
};

export const addConsagratedService = async (
  churchId: string,
  consagracaoId: string,
  users: {
    name: string;
    id: string;
    rede: string;
    role: TMinisterialLevel;
    nextRole: TMinisterialLevel;
  }[], // se existir, faz update/add
) => {
  if (!consagracaoId || !churchId) {
    throw new Error("Informação Faltando");
  }

  const nextRole = users[0].nextRole;
  return consagracaoRepository.addCargo(churchId, consagracaoId, nextRole, users);
};

export const addConsagratedUsersService = async (
  churchId: string,
  consagracaoId: string,
  data: {
    users: Record<
      TMinisterialLevel,
      {
        id: string;
        name: string;
        rede: string;
        nextRole: TMinisterialLevel;
        role: TMinisterialLevel;
      }[]
    >;
    date?: Date | string; // ✅ Adiciona date opcional
  },
) => {
  if (!consagracaoId || !churchId) {
    throw new Error("Informação Faltando");
  }

  // ✅ Valida se users existe
  if (!data || !data.users) {
    throw new Error("Dados de usuários não fornecidos");
  }

  // ✅ Usa a data fornecida ou a data atual
  const consagracaoDate = data.date
    ? new Date(data.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const resultados = {
    sucesso: [] as string[],
    erro: [] as { user: any; erro: string }[],
  };

  // ✅ Itera sobre data.users (não data diretamente)
  for (const [nivelDestino, users] of Object.entries(data.users)) {
    console.log(`\n📋 Processando consagrações para: ${nivelDestino}`);

    // ✅ Valida se users é um array
    if (!Array.isArray(users)) {
      console.warn(`⚠️  ${nivelDestino} não é um array válido`);
      continue;
    }

    for (const user of users) {
      console.log(`  ✅ ${user.name}`);
      console.log(`     ${user.role} → ${user.nextRole}`);

      try {
        await userRepository.addConsagracao({
          id: user.id,
          ministerialLevel: user.nextRole,
          data: consagracaoDate, // ✅ Usa a data da consagração
        });

        console.log(`  ✅ ${user.name} - Sucesso`);
        resultados.sucesso.push(user.id);
      } catch (error) {
        console.log(`  ❌ ${user.name} - Erro`);
        resultados.erro.push({
          user,
          erro: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }
  }

  // ✅ Retry dos que falharam
  const MAX_RETRIES = 3;

  for (let tentativa = 1; tentativa <= MAX_RETRIES; tentativa++) {
    if (resultados.erro.length === 0) break;

    console.log(
      `\n🔄 Tentativa ${tentativa} de ${MAX_RETRIES} para ${resultados.erro.length} usuários`,
    );

    const errosParaRetry = [...resultados.erro];
    resultados.erro = []; // Limpa para receber novos erros

    for (const { user } of errosParaRetry) {
      try {
        await userRepository.addConsagracao({
          id: user.id,
          ministerialLevel: user.nextRole,
          data: consagracaoDate, // ✅ Usa a data da consagração
        });

        console.log(`  ✅ ${user.name} - Sucesso no retry`);
        resultados.sucesso.push(user.id);
      } catch (error) {
        console.log(`  ❌ ${user.name} - Falhou novamente`);
        resultados.erro.push({
          user,
          erro: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }

      // Delay entre retries para não sobrecarregar
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // ✅ Marca como concluída APENAS se não houver erros
  if (resultados.erro.length === 0) {
    await consagracaoRepository.updateConsagracaoConclusao(
      churchId,
      consagracaoId,
      new Date(), // ✅ Data de conclusão
    );
    console.log("✅ Consagração marcada como concluída");
  } else {
    console.log(`⚠️  Consagração não foi marcada como concluída (${resultados.erro.length} erros)`);
  }

  return {
    total: resultados.sucesso.length + resultados.erro.length,
    sucesso: resultados.sucesso.length,
    falhas: resultados.erro.length,
    erros: resultados.erro,
    dataCosnagracao: consagracaoDate, // ✅ Retorna a data usada
  };
};
