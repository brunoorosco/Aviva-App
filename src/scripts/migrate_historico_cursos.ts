import dotenv from 'dotenv'
dotenv.config()

import { MongoHelper } from '../infra/db/mongoHelper'
import { historico } from './usuarios'

async function run() {
  console.log(process.env.MONGODB_URI)
  try {
    await MongoHelper.connect(process.env.MONGODB_URI!)
    const users = await MongoHelper.getCollection('users')
    for (const entry of historico) {
      const nomeLower = entry.nome.toLowerCase().trim()

      // Busca ignorando maiúsculas/minúsculas
      const usuarios = await users
        .find({
          name: { $regex: new RegExp(`^${nomeLower}$`, 'i') }
        })
        .toArray()

      if (usuarios.length === 0) {
        console.log(`❌ Usuário não encontrado: ${entry.nome}`)
        continue
      }

      if (usuarios.length > 1) {
        console.log(`⚠️ Vários usuários encontrados para: ${entry.nome}`)
        continue
      }

      const user = usuarios[0]
      const historicoAtual = user.historicoEscolaProfeta || []

      // Faz merge sem duplicar curso_id
      const novosCursos = [...historicoAtual]

      for (const cursoNovo of entry.historico) {
        const idx = novosCursos.findIndex(
          (c: any) => c.curso_id === cursoNovo.curso_id
        )
        if (idx >= 0) {
          // Atualiza o status se já existir
          novosCursos[idx].status = cursoNovo.status
        } else {
          novosCursos.push(cursoNovo)
        }
      }

      // Só atualiza se houver mudanças
      const precisaAtualizar =
        JSON.stringify(novosCursos) !== JSON.stringify(historicoAtual)

      if (precisaAtualizar) {
        const result = await users.updateOne(
          { _id: user._id },
          { $set: { historicoEscolaProfeta: novosCursos } }
        )

        if (result.modifiedCount === 1) {
          console.log(`✅ Atualizado com sucesso: ${entry.nome}`)
        } else {
          console.log(`❌ Não conseguiu atualizar: ${entry.nome}`)
        }
      } else {
        console.log(`ℹ️ Já estava atualizado: ${entry.nome}`)
      }
    }
  } catch (err) {
    console.error('Erro ao rodar migração:', err)
  } finally {
    await MongoHelper.disconnect()
  }
}

run().catch(console.error)
