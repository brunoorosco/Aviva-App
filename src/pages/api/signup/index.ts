// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import CryptAdapter from '@/infra/cryptography/bcrypt'

type Data = {
  password: string
  compar: boolean
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cripto = new CryptAdapter()
  const setPassword = cripto.hashPassword('123456')
  const compar = cripto.compare('123456', setPassword)
  res.status(200).json({ password: setPassword, compar })
}
