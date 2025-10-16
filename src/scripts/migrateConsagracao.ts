import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import stringSimilarity from "string-similarity";
import { MongoHelper } from "../infra/db/mongoHelper";

type Consagracao = {
  name: string;
  ministerialLevel: string;
  data: string;
};

async function run() {
  try {
    await MongoHelper.connect(process.env.MONGODB_URI!);
    const usersCollection = await MongoHelper.getCollection("users");

    // 🔹 Carrega o arquivo JSON local
    const jsonData = fs.readFileSync("./src/scripts/consagracao_2024.json", "utf-8");
    const consagracoes: Consagracao[] = JSON.parse(jsonData);

    const allUsers = await usersCollection.find().toArray();
    console.log(`🔍 ${consagracoes.length} consagrações para processar...`);

    for (const consagracao of consagracoes) {
      const nomeConsagracao = normalize(consagracao.name);

      let bestMatch: any = null;
      let bestScore = 0;

      for (const user of allUsers) {
        const nomeUser = normalize(user.name);
        const score = stringSimilarity.compareTwoStrings(nomeConsagracao, nomeUser);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = user;
        }
      }

      if (bestMatch && bestScore > 0.6) {
        const consagracaoObj = {
          ministerialLevel: consagracao.ministerialLevel,
          data: consagracao.data,
        };

        // 🔸 Evita duplicar registros na lista consagracao[]
        const existing = (bestMatch.consagracao || []).some(
          (c: any) =>
            c.ministerialLevel === consagracaoObj.ministerialLevel && c.data === consagracaoObj.data
        );

        if (!existing) {
          await usersCollection.updateOne(
            { _id: bestMatch._id },
            //@ts-ignore
            { $push: { consagracao: consagracaoObj } }
          );
          console.log(`✅ Atualizado: ${bestMatch.name} (${bestScore.toFixed(2)})`);
        } else {
          console.log(`⚠️ Já possuía consagração: ${bestMatch.name}`);
        }
      } else {
        console.log(`❌ Não encontrado para: ${consagracao.name} (${bestScore.toFixed(2)})`);
      }
    }

    console.log("✔️ Migração concluída com sucesso.");
  } catch (err) {
    console.error("❌ Erro na migração:", err);
  } finally {
    await MongoHelper.disconnect();
  }
}

// Função utilitária para normalizar strings
function normalize(str?: string): string {
  if (!str || typeof str !== 'string') return '' // evita erro se vier null ou undefined
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z\s]/g, '') // mantém apenas letras e espaços
    .trim()
}

run();
