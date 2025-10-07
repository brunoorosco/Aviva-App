import dotenv from 'dotenv'
dotenv.config()

import { MongoHelper } from '../infra/db/mongoHelper'
import stringSimilarity from 'string-similarity'

async function run() {
  try {
    await MongoHelper.connect(process.env.MONGODB_URI!)
    const users = await MongoHelper.getCollection('users')
    const courses = await MongoHelper.getCollection('course')

    // Pega todos os usuários de uma vez
    const allUsers = await users.find().toArray()

    // Itera pelos cursos
    const cursos = await courses.find().toArray()
    for (const curso of cursos) {
      if (curso.alunos) {
        let updated = false
        const novosAlunos = curso.alunos.map((aluno: any) => {
          const nomeAluno = aluno.nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')

          // Busca melhor correspondência
          let bestMatch: any = null
          let bestScore = 0

          for (const u of allUsers) {
            const nomeUser = u.name
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
            const score = stringSimilarity.compareTwoStrings(
              nomeAluno,
              nomeUser
            )
            if (score > bestScore) {
              bestScore = score
              bestMatch = u
            }
          }

          if (bestMatch && bestScore > 0.4 && aluno._id !== bestMatch._id) {
            updated = true
            return { ...aluno, _id: bestMatch._id.toString() }
          }
          return aluno
        })

        if (updated) {
          const result = await courses.updateOne(
            { _id: curso._id },
            { $set: { alunos: novosAlunos } }
          )
          if (result.modifiedCount === 1) {
            console.log(`✅ Curso atualizado: ${curso.tema}`)
          }
        }
      } else {
        console.log(`ℹ️ Curso sem alterações: ${curso.tema}`)
      }
    }

    console.log('✔️ Migração concluída')
  } catch (err) {
    console.error('Erro:', err)
  } finally {
    await MongoHelper.disconnect()
  }
}

run().catch(console.error)
