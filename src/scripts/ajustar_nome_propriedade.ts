import dotenv from 'dotenv'
dotenv.config()

import { MongoHelper } from '../infra/db/mongoHelper'

async function run() {
  await MongoHelper.connect(process.env.MONGODB_URI!)
  const users = await MongoHelper.getCollection('users')

  try {
    const usuarios = await users
      .find({ historicoEscolaProfeta: { $exists: true, $ne: [] } })
      .toArray()

    console.log(`🔎 Encontrados ${usuarios.length} usuários com histórico`)

    for (const user of usuarios) {
      const historico = user.historicoEscolaProfeta.map((curso: any) => {
        if (curso.nomeCurso && !curso.cursoName) {
          const { nomeCurso, ...rest } = curso
          return { ...rest, cursoName: nomeCurso }
        }
        return curso
      })

      // Verifica se algo realmente mudou
      const precisaAtualizar =
        JSON.stringify(historico) !==
        JSON.stringify(user.historicoEscolaProfeta)

      if (precisaAtualizar) {
        await users.updateOne(
          { _id: user._id },
          { $set: { historicoEscolaProfeta: historico } }
        )
        console.log(`✅ Atualizado: ${user.name}`)
      }
    }

    console.log('🎉 Finalizado com sucesso.')
  } catch (err) {
    console.error('❌ Erro ao processar:', err)
  } finally {
    await MongoHelper.disconnect()
  }
}

run().catch(console.error)
