// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import CryptAdapter from '@/infra/cryptography/bcrypt'

type Data = {
  password: string
  compar: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cripto = new CryptAdapter('teste')
  const setPassword = cripto.hashPassword('123456')
  const compar = cripto.compare('123456')
  res.status(200).json({ password: setPassword, compar })
}
