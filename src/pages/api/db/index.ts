import dotenv from 'dotenv'
import { NextApiRequest, NextApiResponse } from 'next'
dotenv.config()
const mysql = require('mysql2')

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL)

    connection.query(
      'SELECT * FROM `members` WHERE `id` = "31"',
      function (err: any, results: any, fields: any) {}
    )
    connection.end()
    res.send('ok')
  } catch {}
}
