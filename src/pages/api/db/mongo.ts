import CryptAdapter from '@/infra/cryptography/bcrypt'
import { MongoHelper } from '@/infra/db/mongoHelper'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const collection = MongoHelper.getCollection('churchs')
    const cripto = new CryptAdapter()
    const setPassword = cripto.hashPassword('123456')
    res.send(setPassword)
  } catch (err) {
    res.send({ err })
  }
}
