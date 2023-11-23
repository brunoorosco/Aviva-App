import { prisma } from '../prismaClient'
import mysql from 'mysql2'

const connection = mysql.createPool({
  host: 'localhost:3309',
  user: 'root',
  password: '',
  database: 'churches'
  // uri: 'mysql://root@localhost:3309/churches'
})
export interface TUser {
  id?: string
  name: string
  password?: string
  email: string
}

type TAddress = {
  street: string
  number: string
  city: string
  cep: string
  state: string
}

type ParamsUser = {
  name: string
  email: string
  birth: string
  password: string
  address: TAddress
  profile_id?: number
}

export class Users {
  async create(params: ParamsUser): Promise<any> {
    const user = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        birth: new Date(params.birth),
        password: params.password,
        profile_id: params.profile_id,
        address: {
          create: {
            cep: params.address.cep,
            city: params.address.city,
            number: params.address.number,
            state: params.address.state,
            street: params.address.street
          }
        }
      }
    })

    return user
  }

  async checkByEmail(email: string): Promise<any> {
    const isValid = await prisma.user.findUnique({
      where: {
        email
      }
    })
    return isValid
  }

  async getUserSupervisories(churchId: string): Promise<any> {
    const query = await prisma.$queryRaw`
    SELECT user.name, user.id from user 
    join churchescem c2 on c2.cem_id = user.cem_id 
    where user.profile_id = 4 and c2.churches_id = ${churchId}`

    return query
  }
}
export async function getAllUsers() {
  const data = await prisma.user.findMany()
  return data
}

export async function getAllUsersByProfile() {
  const query = `SELECT * FROM user`
  const data = await connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro na consulta SELECT: ', error)
      return
    }

    // Processar os resultados aqui
    console.log('Resultados da consulta SELECT: ', results)
  })
  connection.end((error) => {
    if (error) {
      console.error('Erro ao encerrar a conexão: ', error)
      return
    }
  })

  console.log('Conexão encerrada com sucesso')

  // const data = await prisma.user.findMany({
  // where: { profile_id: 3 }
  // })
  return data
}
