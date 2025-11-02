import dotenv from "dotenv";
import stringSimilarity from "string-similarity";
dotenv.config();

import { MongoHelper } from "../infra/db/mongoHelper";

async function run() {
  console.log("Conectando ao MongoDB...");
  await MongoHelper.connect(process.env.MONGODB_URI!);
  const users = await MongoHelper.getCollection("users");
  const courses = await MongoHelper.getCollection("course");

  try {
    const todosCursos = await courses
      .find({
        alunos: { $exists: true, $ne: [] }, // garante que o array existe e não está vazio
      })
      .toArray();

    const allUsers = await users.find().toArray();
    console.log(`📚 Encontrados ${todosCursos.length} cursos com alunos`);

    for (const curso of todosCursos) {
      const cursoInfo = {
        curso_id: curso._id.toString(),
        nomeCurso: curso.tema,
        tipoCurso: curso.tipoCurso,
        data: curso.data,
        status: "CONCLUÍDO",
        numeroAulas: curso.numeroAulas,
      };

      for (const aluno of curso.alunos) {
        const nomeAluno = normalize(aluno.nome);

        // Tenta achar usuário por nome exato
        let usuario = allUsers.find((u) => normalize(u.name) === nomeAluno);

        let matchScore = 1;

        // Se não achou, busca por similaridade
        if (!usuario) {
          let bestMatch: any = null;
          let bestScore = 0;

          for (const user of allUsers) {
            const nomeUser = normalize(user.name);
            const score = stringSimilarity.compareTwoStrings(nomeAluno, nomeUser);
            if (score > bestScore) {
              bestScore = score;
              bestMatch = user;
            }
          }

          if (bestMatch && bestScore > 0.6) {
            usuario = bestMatch;
            matchScore = bestScore;
            console.log(
              `🤝 Nome semelhante encontrado: "${aluno.nome}" ≈ "${
                usuario?.name
              }" (score: ${bestScore.toFixed(2)})`
            );
          } else {
            console.log(
              `❌ Usuário não encontrado: ${aluno.nome} (melhor score: ${bestScore.toFixed(2)})`
            );
            continue;
          }
        }

        const historicoAtual = Array.isArray(usuario?.historicoEscolaProfeta)
          ? usuario?.historicoEscolaProfeta
          : [];

        // Cria um Map para evitar duplicatas
        const mapCursos = new Map<string, any>();
        if (!historicoAtual) throw "ERROR HISTORICO";
        for (const c of historicoAtual) {
          mapCursos.set(String(c.curso_id), { ...c });
        }

        // Faz merge ou insere novo curso
        const existente = mapCursos.get(cursoInfo.curso_id);
        const novoStatus = aluno.status || "CONCLUÍDO";

        if (existente) {
          console.log("staus", aluno.status);
          mapCursos.set(cursoInfo.curso_id, {
            ...existente,
            //status: existente.novoStatus,
            // cursoName: existente.cursoName,
            // date: existente.data,
          });
        } else {
          console.log("staus123", aluno.status);

          mapCursos.set(cursoInfo.curso_id, {
            ...cursoInfo,
            status: novoStatus,
            // cursoName: cursoInfo.cursoName,
            // date: cursoInfo.data,
          });
        }

        const novosCursos = Array.from(mapCursos.values());

        // Só atualiza se algo realmente mudou
        const precisaAtualizar = JSON.stringify(historicoAtual) !== JSON.stringify(novosCursos);

        if (precisaAtualizar) {
          // 🔹 Padroniza os cursos antes de atualizar
          const cursosPadronizados = novosCursos.map((curso: any) => {
            const novoCurso: any = { ...curso };

            // ✅ Renomeia nomeCurso -> cursoName
            if (novoCurso.nomeCurso && !novoCurso.cursoName) {
              novoCurso.cursoName = novoCurso.nomeCurso;
              delete novoCurso.nomeCurso;
            }

            // ✅ Garante chaves principais
            novoCurso.curso_id = novoCurso.curso_id || null;
            novoCurso.cursoName = novoCurso.cursoName || "SEM NOME";
            delete novoCurso.presencas;
            delete novoCurso.numeroAulas;
            delete novoCurso.tipoCurso;

            return novoCurso;
          });

          const result = await users.updateOne(
            //@ts-ignore
            { _id: usuario._id },
            { $set: { historicoEscolaProfeta: novosCursos } }
          );

          if (result.modifiedCount === 1) {
            console.log(`✅ Atualizado: ${aluno.nome} (${curso.tema})`);
          } else {
            console.log(`❌ Falha ao atualizar: ${aluno.nome}`, result);
          }
        } else {
          console.log(`ℹ️ Já atualizado: ${aluno.nome} (${curso.tema})`);
        }
      }
    }
  } catch (err) {
    console.error("Erro ao processar:", err);
  } finally {
    await MongoHelper.disconnect();
    console.log("Conexão encerrada.");
  }
}

// 🧩 Função de normalização (remove acentos, espaços extras etc.)
function normalize(str?: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z\s]/g, "") // mantém apenas letras e espaços
    .trim();
}

run().catch(console.error);
