import type { NextApiRequest, NextApiResponse } from 'next'
import { CEM } from '@prisma/client'
import { findCem, findCemById } from '@/infra/services/cems'

type CemId = {
  id: String
}
type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CEM[] | CEM | CemId | Error>
) {
  // if (req.method === 'POST') {
  //   const newData: Prisma.CEMCreateInput = {
  //     name: req.body.cem,
  //     number: req.body.number,
  //     cep: req.body.zipcode,
  //     city: req.body.city,
  //     street: req.body.street,
  //     churchid: req.body.churchid
  //   }

  //   const saved = await create(newData)
  //   return res.status(200).json(saved)
  // }

  if (req.method === 'GET') {
    const { churchid } = req.query

    const cem = await findCem(churchid as string)

    return res.status(200).json(cem)
  }

  return res.status(200).json([])
}
