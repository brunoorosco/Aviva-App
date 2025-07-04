import dotenv from 'dotenv'
dotenv.config()

import { MongoHelper } from '../infra/db/mongoHelper'

const courses = [
  { id: 1, name: 'Angelologia' },
  { id: 2, name: 'Honra' },
  { id: 3, name: 'Geografia Bíblica' },
  { id: 4, name: 'Escatologia' },
  { id: 5, name: 'Simbologia e Tipologia' },
  { id: 6, name: 'Teologia' },
  { id: 7, name: 'Os Pecados Capitais' },
  { id: 8, name: 'A Igreja' },
  { id: 9, name: 'Livro de Atos dos Apostolos' },
  { id: 10, name: 'Livro de 1 Corintios' },
  { id: 11, name: 'Livro de 2 Corintios' }
]

async function run() {
  console.log(process.env.MONGODB_URI)
  await MongoHelper.connect(process.env.MONGODB_URI!)
  const mongo = await MongoHelper.getCollection('course')
  const result = await mongo.insertMany(courses)
  console.log('Cursos inseridos:', result.insertedCount)

  await MongoHelper.disconnect()
}

run().catch(console.error)
