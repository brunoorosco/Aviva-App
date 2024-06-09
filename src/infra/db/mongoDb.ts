import { MongoClient, Db } from 'mongodb'

// URL de conexão com o banco de dados
const url = 'mongodb://localhost:27017'

// Nome do banco de dados que você deseja acessar
const dbName = 'seu_banco_de_dados'

// Função para conectar ao banco de dados
export async function connectToDatabase(): Promise<Db> {
  const client = new MongoClient(url)

  try {
    // Conecta ao servidor MongoDB
    await client.connect()

    console.log('Conexão bem-sucedida ao servidor MongoDB')

    // Retorna uma referência para o banco de dados especificado
    return client.db(dbName)
  } catch (error) {
    console.error('Erro ao conectar ao servidor MongoDB:', error)
    throw error
  }
}
